import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Cloud from '@mui/icons-material/Cloud'
import ContentCut from '@mui/icons-material/ContentCut'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import { useState } from 'react'
import ListCards from './ListCards/ListCards'
import { mapOrder } from '~/utils/sort'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'

function Column({ column, createNewCard }) {
  // DnD Kit sortable hook
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyle = {
    // dnd kit isues 117
    // transform: CSS.Transform.toString(transform),
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
    // touchAction: 'none',
  }

  // Dropdown menu state
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(prev => !prev)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = () => {
    if (!newCardTitle.trim()) {
      toast.error('Please enter a valid card title')
      return
    }
    // console.log('Add new card:', newCardTitle)
    // Api call
    const newCardData ={
      title: newCardTitle,
      columnId: column._id,
    }

    // To Do Use Redux
    createNewCard(newCardData)

    // Reset form
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // Order cards
  const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes} >
      <Box
        // only listen from box, not whole column to prevent some idiot place
        {...listeners}
        sx={(theme) => ({
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`,
          ...theme.applyStyles('dark', {
            bgcolor: '#333643'
          }),
        })}>
        {/* Header */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Typography
            variant='h6'
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {column?.title}
          </Typography>

          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>

            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-column-dropdown',
                },
              }}
            >
              <MenuItem>
                <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* List cards */}
        <ListCards cards={orderedCards} />

        {/* Footer */}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2,
          }}>
          {!openNewCardForm ?
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'grab' }} />
              </Tooltip>
            </Box> :
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                label="Enter card title"
                type="text"
                size='small'
                variant='outlined'
                autoFocus // auto focus when form opens
                data-no-dnd="true" // custom attribute to block dnd kit events
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1
                  }
                }}
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Button
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main },
                  }}
                  onClick={addNewCard}
                >
                  Add
                </Button>
                <CloseIcon
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer',
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          }


        </Box>
      </Box>
    </div>
  )
}

export default Column