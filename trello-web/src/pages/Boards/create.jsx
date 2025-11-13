import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import DescriptionIcon from '@mui/icons-material/Description'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { createNewBoardAPI } from '~/apis'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  padding: '12px 16px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#e9f2ff',
  },
}))

const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
}

function SidebarCreateBoardModal({ afterCreateNewBoard }) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      type: BOARD_TYPES.PUBLIC,
    },
  })
  const [isOpen, setIsOpen] = useState(false)
  const handleOpenModal = () => {
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    reset()
  }

  const submitCreateBoard = (data) => {
    // const { title, description, type } = data
    createNewBoardAPI(data).then(() => {
      handleCloseModal()
      // noti parent component to load again
      afterCreateNewBoard()
    })
  }

  return (
    <>
      <SidebarItem onClick={handleOpenModal}>
        <LibraryAddIcon fontSize="small" />
        Create a new board
      </SidebarItem>

      <Modal
        open={isOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: '8px',
            border: 'none',
            outline: 0,
            padding: '20px 30px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LibraryAddIcon />
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Create a new board
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                color: 'error.main',
                '&:hover': { bgcolor: 'error.light', color: 'white' },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={handleSubmit(submitCreateBoard)} noValidate>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Title
              </Typography>
              <TextField
                fullWidth
                placeholder="abc"
                {...register('title', {
                  required: 'Title is required',
                  minLength: { value: 3, message: 'Title must be at least 3 characters' },
                })}
                error={!!errors.title}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
              <FieldErrorAlert errors={errors} fieldName="title" />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Description
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Enter board description..."
                {...register('description')}
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'action.active' }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            </Box>

            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field} row>
                    <FormControlLabel value={BOARD_TYPES.PUBLIC} control={<Radio />} label="Public" />
                    <FormControlLabel value={BOARD_TYPES.PRIVATE} control={<Radio />} label="Private" />
                  </RadioGroup>
                )}
              />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  textTransform: 'none',
                  px: 4,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default SidebarCreateBoardModal
