import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { DndContext, useSensor, MouseSensor, TouchSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, closestCorners } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Columns/Column'
import Card from './ListColumns/Columns/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

//
const ACTIVE_DRAG_ITEM_STYLE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_STYLE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_STYLE_CARD',
}

function BoardContent({ board }) {
  // const pointerSensor = useSensor(PointerSensor,
  //   {
  //     // require user to move 10 pixels before activating drag
  //     activationConstraint: {
  //       distance: 10,
  //     }
  //   }
  // )
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10, } })

  //touch and hold for 250ms delay, difference tolerance 5px
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // priority use mouse and touch sensor to have better mobile experience
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  // at a time , only 1 colums or card is being dragged
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  useEffect(() => {
    const tmp = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(tmp)
  }, [board])


  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Handle drag start event
  const handleDragStart = (event) => {
    //console.log('Drag Started', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_STYLE.CARD : ACTIVE_DRAG_ITEM_STYLE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // Handle drag over event, trigger when dragging item over another droppable area
  const handleDragOver = (event) => {

    // Do nothing with drag column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.COLUMN) return

    //console.log('Drag Over', event)
    // Card
    const { active, over } = event
    // prevent drag to some idiot place
    if (!active && !over) return

    // activeDraggingCardId: id of the card being dragged
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId: id of the card being hovered over
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // If the card is being dragged to a different column with the current collums of the car
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns((prev) => {
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        let newCardIndex
        const isBellowOverItem = active.rect?.current?.translated &&
          active.rect.current.translated.top > (over.rect?.current?.top ?? 0) + (over.rect?.current?.height ?? 0)

        const modifier = isBellowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // deep clone by lodash
        const nextColumns = cloneDeep(prev)

        const nextActiveColumn = nextColumns.find(col => col._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(col => col._id === overColumn._id)

        if (nextActiveColumn) {
          // delete card from previous column
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // update card order ids
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }
        if (nextOverColumn) {
          // delete card from previous column just in case
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // insert card into new column index new
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // update card order ids
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        return nextColumns
      })
    }
  }

  // Handle drag end event
  const handleDragEnd = (event) => {
    //console.log('Drag Ended', event)

    const { active, over } = event

    // prevent drag to some idiot place
    if (!active && !over) return

    // Handle card drag end
    if (activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.CARD) {
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      // Dragging card in the same column
      if (activeColumn._id === overColumn._id) {
        const oldCardIndex = activeColumn?.cards?.findIndex(card => card._id === activeDraggingCardId)
        const newCardIndex = activeColumn?.cards?.findIndex(card => card._id === overCardId)

        const dndOrderedCards = arrayMove(activeColumn?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns((prev) => {
          const nextColumns = cloneDeep(prev)
          const targetColumn = nextColumns.find(col => col._id === activeColumn._id)
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          return nextColumns
        })
      }

      // Reset active drag item state
      setActiveDragItemId(null)
      setActiveDragItemType(null)
      setActiveDragItemData(null)
      return
    }

    // Handle column drag end
    // Check if the item was moved to a different position
    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(col => col._id === active.id)
      const newIndex = orderedColumns.findIndex(col => col._id === over.id)

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      //const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)

      // console.log(dndOrderedColumns)
      // console.log({ dndOrderedColumnsIds })

      setOrderedColumns(dndOrderedColumns)
    }

    // Reset active drag item state
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        }
      }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      // algorithm fix big cards dnd issues by algorithm closestCorners
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={(theme) => ({
        width: '100%',
        height: theme.trello.boardContentHeight,
        bgcolor: '#1976d2',
        ...theme.applyStyles('dark', {
          bgcolor: '#34495e'
        }),
        p: '10px 0',
      })}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemId || !activeDragItemType) && null}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemId && activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent