import Autocomplete from '@mui/material/Autocomplete'
import { useEffect, useState } from 'react'
import { useNavigate, createSearchParams } from 'react-router-dom'

function AutoCompleteSearchBoard() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setBoards(null)
    }
  }, [open])

  const handleInputSearchChange = (e) => {
    const searchText = e.target.value.trim()
    if (!searchText) return

    const searchPath = `?${createSearchParams({ 'q[title]': searchText })}`
    console.log('searchPath: ', searchPath)
  }

  const handleSelectBoard = (event, selectBoard) => {
    console.log('selectBoard: ', selectBoard)
  }
  return (
    <Autocomplete
      sx={{ width: 220 }}
      id="asynchronous-search-board"
      noOptionsText={!boards ? 'Type to search' : 'No board found'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={(board) => board.title}
    >
      {/* <TextField
          id="outlined-search"
          label="Search field"
          type="text"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white ' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  sx={{
                    color: `${searchText ? 'white' : 'transparent'}`,
                    fontSize: 'small',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSearchText('')}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '190px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
          }}
        /> */}
    </Autocomplete>
  )
}

export default AutoCompleteSearchBoard
