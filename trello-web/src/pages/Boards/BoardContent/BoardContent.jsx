import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

function BoardContent() {
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
      <ListColumns />
    </Box>
  )
}

export default BoardContent