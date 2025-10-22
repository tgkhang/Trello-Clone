import Box from '@mui/material/Box'

function BoardContent() {
  return (
    <Box sx={{
      width: '100%',
      height: 'calc(100vh - 58px - 48px)',
      display: 'flex',
      alignItems: 'center',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#30495e' : '#1976d2'),
    }}>
      Board centent
    </Box>
  )
}

export default BoardContent