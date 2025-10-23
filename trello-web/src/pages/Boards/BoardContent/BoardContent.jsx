import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  const pointerSensor = useSensor(PointerSensor,
    {
      // require user to move 10 pixels before activating drag
      activationConstraint: {
        distance: 10,
      }
    }
  )
  const sensors= useSensors(pointerSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

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
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
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
      </Box>
    </DndContext>
  )
}

export default BoardContent