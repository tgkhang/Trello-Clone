import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, createSearchParams } from 'react-router-dom'
import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/hooks/useDebounceFn'

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

  const handleInputSearchChange = useCallback((_event, value, reason) => {
    if (reason !== 'input') return
    const searchText = value.trim()
    if (!searchText) return

    const searchPath = `?${createSearchParams({ 'q[title]': searchText })}`
    setLoading(true)
    fetchBoardsAPI(searchPath)
      .then((res) => {
        setBoards(res.boards || [])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 1000)

  const handleSelectBoard = (event, selectBoard) => {
    if (selectBoard) navigate(`/boards/${selectBoard._id}`)
  }
  return (
    <Autocomplete
      sx={{ width: 220 }}
      id="asynchronous-search-board"
      noOptionsText={!boards ? 'Type to search' : 'No board found'}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={boards || []}
      loading={loading}
      getOptionLabel={(board) => board.title}
      onChange={handleSelectBoard}
      onInputChange={debounceSearchBoard}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search boards..."
          size="small"
          sx={{
            '& label': { color: 'white' },
            '& input': { color: 'white', fontSize: '0.875rem' },
            '& .MuiInputBase-input::placeholder': {
              color: 'white',
              opacity: 0.7,
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white',
                borderWidth: '1px',
              },
              '&:hover fieldset': {
                borderColor: 'white',
                borderWidth: '2px',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
                borderWidth: '2px',
              },
            },
            '& .MuiSvgIcon-root': {
              color: 'white',
            },
          }}
        />
      )}
    ></Autocomplete>
  )
}

export default AutoCompleteSearchBoard
