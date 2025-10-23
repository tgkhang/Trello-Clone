import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sort'
import { DndContext } from '@dnd-kit/core'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    const tmp = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(tmp)
  }, [board])

  const handleDragEnd = (event) => {
    //console.log('Drag Ended', event)

  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
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