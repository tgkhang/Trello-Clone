import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { DndContext, useSensor, MouseSensor, TouchSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import Column from './ListColumns/Columns/Column'
import Card from './ListColumns/Columns/ListCards/Card/Card'

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

  const handleDragEnd = (event) => {
    //console.log('Drag Ended', event)
    const { active, over } = event

    // prevent drag to some idiot place
    if (!over) return

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

  const handleDragStart = (event) => {
    //console.log('Drag Started', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_STYLE.CARD : ACTIVE_DRAG_ITEM_STYLE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
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
      onDragStart={handleDragStart}
      sensors={sensors}
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