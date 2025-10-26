import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { DndContext, useSensor, MouseSensor, TouchSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, closestCorners, pointerWithin, rectIntersection, getFirstCollision, closestCenter } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import Column from './ListColumns/Columns/Column'
import Card from './ListColumns/Columns/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

// Define active drag item styles
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

  // Require move 10 pixel before activating
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10, } })

  // Touch and hold for 250ms delay, difference tolerance 5px
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Priority use mouse and touch sensor to have better mobile experience
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])
  // At a time , only 1 column or card is being dragged
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  // store old column when dragging card
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  // last collision id
  const lastOverId = useRef(null)

  // Update ordered columns when board data changes
  useEffect(() => {
    const tmp = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(tmp)
  }, [board])

  const findColumnByCardId = (cardId) => {
    // map to take out id in full objects
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Common function : update state when moving card between different columns
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prev) => {
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      let newCardIndex
      // const isBellowOverItem = active.rect?.current?.translated &&
      //   active.rect.current.translated.top > (over.rect?.current?.top ?? 0) + (over.rect?.current?.height ?? 0)

      // const modifier = isBellowOverItem ? 1 : 0
      // newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      newCardIndex = overCardIndex >= 0 ? overCardIndex : overColumn?.cards?.length

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

        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // insert card into new column index new
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // update card order ids
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  // Handle drag start event
  const handleDragStart = (event) => {
    //console.log('Drag Started', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_STYLE.CARD : ACTIVE_DRAG_ITEM_STYLE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Handle drag over event, trigger when dragging item over another droppable area
  const handleDragOver = (event) => {

    // Do nothing with drag column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.COLUMN) return

    //console.log('Drag Over', event)
    // Card
    const { active, over } = event
    // prevent drag to some idiot place
    if (!active || !over) return

    // activeDraggingCardId: id of the card being dragged
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId: id of the card being hovered over
    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // If the card is being dragged to a different column
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
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

      // activeDraggingCardId: id of the card being dragged
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCardId: id of the card being hovered over
      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return

      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // Card was moved to a different column
        // console.log('Card moved to different column')
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Card was moved within the same column
        // logic same as drag colums in board
        // console.log('Card moved within the same column')
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(col => col._id === activeDragItemId)
        const newCardIndex = overColumn?.cards?.findIndex(col => col._id === overCardId)

        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        //console.log(dndOrderedCards)

        setOrderedColumns((prev) => {
          const nextColumns = cloneDeep(prev)
          //find the target column
          const targetColumn = nextColumns.find(col => col._id === overColumn._id)
          // update cards and card order ids
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          return nextColumns
        })
      }

    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.COLUMN) {
      // Handle column drag end
      // Check if the item was moved to a different position
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(col => col._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(col => col._id === over.id)

        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        //const dndOrderedColumnsIds = dndOrderedColumns.map(col => col._id)

        // console.log(dndOrderedColumns)
        // console.log({ dndOrderedColumnsIds })

        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Reset active drag item state
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
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

  const collisionDetectionStrategy = useCallback((args) => {
    // for column drag use default closestCorners algorithm
    if (activeDragItemType === ACTIVE_DRAG_ITEM_STYLE.COLUMN) {
      return closestCorners({ ...args })
    }

    const pointerIntersections = pointerWithin(args)
    //
    const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)
    // const intersections= pointerIntersections?.length >0 pointerIntersections : rectIntersection(args)

    let overId = getFirstCollision(intersections, 'id')
    if (overId) {
      const checkColumn = orderedColumns.find(col => col._id === overId)
      if (checkColumn) {
        overId = closestCenter({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
          })

        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      sensors={sensors}
      // algorithm fix big cards dnd issues by algorithm closestCorners
      //collisionDetection={closestCorners}
      // custom collision detection strategy if needed
      collisionDetection={collisionDetectionStrategy}
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