import Box from '@mui/material/Box'
import Column from './Columns/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(prev => !prev)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = () => {
    if (!newColumnTitle.trim())
    {
      // console.error('Please enter a valid column title')
      return
    }
    // console.log('Add new column:', newColumnTitle)
    // Api call

    // Reset form
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    //sortable context only use for items type ['id-1', 'id-2'] not an object
    <SortableContext items={columns?.map(column => column._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        overflowX: 'auto',
        overflowY: 'hidden',
        display: 'flex',
        '&::-webkit-scrollbar-track': { m: 2 },
      }}>
        {columns && columns.map((column) => (
          <Column key={column._id} column={column} />
        ))}


        {!openNewColumnForm ?
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
            }}
            onClick={toggleOpenNewColumnForm}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1,
              }}
            >
            Add new column
            </Button>
          </Box>
          :
          // New Column Form
          <Box
            sx= {{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p:1,
              gap:1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
            }}>
            <TextField
              label="Enter column title"
              type="text"
              size='small'
              variant='outlined'
              autoFocus // auto focus when form opens
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                }
              }}
            />
            <Box
              sx={{
                display:'flex',
                alignItems:'center',
                gap:1
              }}
            >
              <Button
                variant='contained'
                color='success'
                size='small'
                sx={{
                  boxShadow:'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main },
                }}
                onClick={addNewColumn}
              >
                Add column
              </Button>
              <CloseIcon
                sx={{
                  color: 'white',

                  cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light },
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }


      </Box>
    </SortableContext >
  )
}

export default ListColumns