import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder} from '~/utils/sort'

function BoardContent({ board }) {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

  return (
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
  )
}

export default BoardContent