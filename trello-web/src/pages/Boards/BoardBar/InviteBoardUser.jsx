import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Popover from '@mui/material/Popover'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { inviteUserToBoardAPI } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { socketIoInstance } from '~/main'

function InviteBoardUser() {
  const board = useSelector(selectCurrentActiveBoard)
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm()

  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) {
      setAnchorPopoverElement(event.currentTarget)
    } else {
      setAnchorPopoverElement(null)
      setValue('inviteEmail', '')
    }
  }

  const submitInviteUserToBoard = (data) => {
    const { inviteEmail } = data

    // Call API to invite user to board
    inviteUserToBoardAPI({
      boardId: board?._id,
      inviteEmail: inviteEmail.trim(),
    }).then((invitation) => {
      setValue('inviteEmail', '')
      setAnchorPopoverElement(null)

      // Real time
      // send invitation to server via socket.io
      socketIoInstance.emit('FE_USER_INVITED_TO_BOARD', invitation)
    })
  }

  return (
    <Box>
      <Tooltip title="Invite user to this board">
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              bgcolor: 'primary.50',
            },
          }}
        >
          Invite
        </Button>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit(submitInviteUserToBoard)}
          sx={{
            p: 3,
            width: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Invite User to Board
          </Typography>

          <Box>
            <TextField
              fullWidth
              label="Enter email to invite"
              type="text"
              variant="outlined"
              autoFocus
              error={!!errors.inviteEmail}
              {...register('inviteEmail', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE,
                },
              })}
            />
            <FieldErrorAlert errors={errors} fieldName="inviteEmail" />
          </Box>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button type="button" variant="outlined" color="inherit" onClick={handleTogglePopover}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Inviting...' : 'Invite'}
            </Button>
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser
