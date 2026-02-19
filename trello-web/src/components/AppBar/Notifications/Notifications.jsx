import { useState, useEffect } from 'react'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Popover from '@mui/material/Popover'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import {
  fetchInvitationsAPI,
  updateBoardInvitationAPI,
  selectCurrentNotifications,
  addNotification,
} from '~/redux/notifications/notificationsSlice'
import { BOARD_INVITATION_STATUS } from '~/utils/constants'
import { toast } from 'react-toastify'
import { socketIoInstance } from '~/socketClient'


function Notifications() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const invitations = useSelector(selectCurrentNotifications)
  const [anchorEl, setAnchorEl] = useState(null)

  const isOpen = Boolean(anchorEl)
  const popoverId = isOpen ? 'notifications-popover' : undefined

  // Fetch invitations when popover opens
  useEffect(() => {
    if (isOpen && currentUser) {
      dispatch(fetchInvitationsAPI())
    }
  }, [isOpen, currentUser, dispatch])

  // Handle real-time invitation via socket.io
  useEffect(() => {
    // function handle when receive real-time invitation via socket.io
    const onReceiveNewInvitation = (invitation) => {
      // Only add if invitation is for current user
      if (invitation?.inviteeId === currentUser?._id) {
        dispatch(addNotification(invitation))

        // Show toast notification
        const inviterName = invitation?.inviter?.displayName || invitation?.inviter?.username || 'Someone'
        const boardTitle = invitation?.board?.title || 'a board'
        toast.info(`${inviterName} invited you to join ${boardTitle}`, { theme: 'colored' })
      }
    }

    //listen real time event name BE_USER_INVITED_TO_BOARD
    socketIoInstance.on('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)

    // clean up to prevent multiple event binding
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_BOARD', onReceiveNewInvitation)
    }
  }, [currentUser, dispatch])

  const handleClickNotification = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const updateInvitationStatus = (invitationId, status) => {
    dispatch(updateBoardInvitationAPI({ invitationId, status }))
      .unwrap()
      .then(() => {
        if (status === 'ACCEPTED') {
          toast.success('Invitation accepted successfully!', { theme: 'colored' })
        } else if (status === 'REJECTED') {
          toast.info('Invitation rejected!', { theme: 'colored' })
        }
      })
      .catch(() => {
        toast.error('Failed to update invitation', { theme: 'colored' })
      })
  }

  const pendingInvitations =
    invitations?.filter((inv) => inv?.boardInvitation?.status === BOARD_INVITATION_STATUS.PENDING) || []

  return (
    <>
      <Tooltip title="Notifications">
        <Badge
          color="error"
          badgeContent={pendingInvitations.length}
          sx={{ cursor: 'pointer' }}
          onClick={handleClickNotification}
          aria-describedby={popoverId}
        >
          <NotificationsNoneIcon sx={{ color: 'white' }} />
        </Badge>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ width: 360, maxHeight: 600, overflowY: 'auto', p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Notifications
          </Typography>

          {!invitations && (
            <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              Loading...
            </Typography>
          )}

          {invitations && invitations.length === 0 && (
            <Typography variant="body2" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
              You do not have any new notifications.
            </Typography>
          )}

          {invitations &&
            invitations.map((invitation, index) => {
              const inviterName = invitation?.inviter?.displayName || invitation?.inviter?.[0]?.username || 'Someone'
              const boardTitle = invitation?.board?.title || 'a board'
              const status = invitation?.boardInvitation?.status
              const createdAt = invitation?.createdAt

              return (
                <Box key={invitation._id || index}>
                  {index > 0 && <Divider sx={{ my: 2 }} />}

                  <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <GroupAddIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>{inviterName}</strong> had invited you to join the board <strong>{boardTitle}</strong>
                      </Typography>

                      {status === BOARD_INVITATION_STATUS.PENDING && (
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            onClick={() => updateInvitationStatus(invitation._id, BOARD_INVITATION_STATUS.ACCEPTED)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 'bold',
                            }}
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            variant="contained"
                            color="secondary"
                            startIcon={<CloseIcon />}
                            onClick={() => updateInvitationStatus(invitation._id, BOARD_INVITATION_STATUS.REJECTED)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 'bold',
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      )}

                      {status === BOARD_INVITATION_STATUS.ACCEPTED && (
                        <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" sx={{ mb: 1 }} />
                      )}

                      {status === BOARD_INVITATION_STATUS.REJECTED && (
                        <Chip
                          icon={<NotInterestedIcon />}
                          label="Rejected"
                          color="default"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      )}

                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {moment(createdAt).format('ddd, MMM DD, YYYY h:mm A')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )
            })}
        </Box>
      </Popover>
    </>
  )
}

export default Notifications
