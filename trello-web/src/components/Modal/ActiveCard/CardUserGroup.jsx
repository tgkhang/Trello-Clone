import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import Avatar from '@mui/material/Avatar'
import AddIcon from '@mui/icons-material/Add'
import Popover from '@mui/material/Popover'
import Badge from '@mui/material/Badge'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'

function CardUserGroup({ cardMemberIds = [], onUpdateCardMembers }) {
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'card-all-users-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const board = useSelector(selectCurrentActiveBoard)

  const FE_CardMembers = board.FE_allMembers.filter((member) => cardMemberIds.includes(member._id))

  const handleUpdateCardMembers = (user) => {
    const incommingMemberInfo = {
      userId: user._id,
      action: cardMemberIds.includes(user._id) ? CARD_MEMBER_ACTIONS.REMOVE : CARD_MEMBER_ACTIONS.ADD,
    }
    onUpdateCardMembers(incommingMemberInfo)
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {/* display user is member of card */}
      {FE_CardMembers.map((user, index) => (
        <Tooltip title={user.displayName} key={index}>
          <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} alt={user.displayName} src={user.avatar} />
        </Tooltip>
      ))}

      <Tooltip title="Add members">
        <Box
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          sx={{
            width: 36,
            height: 36,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: '600',
            borderRadius: '50%',
            color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d'),
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200]),
            '&:hover': {
              color: (theme) => (theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4'),
              bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'),
            },
          }}
        >
          <AddIcon fontSize="small" />
        </Box>
      </Tooltip>

      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, maxWidth: '300px', minWidth: '260px' }}>
          <Box sx={{ mb: 1.5, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ fontSize: '14px', fontWeight: 600, color: 'text.primary' }}>Board Members</Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {board.FE_allMembers.map((user, index) => (
              <Box
                key={index}
                onClick={() => handleUpdateCardMembers(user)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[100]),
                  },
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    cardMemberIds.includes(user._id) ? (
                      <CheckCircleIcon fontSize="small" sx={{ color: '#27ae60' }} />
                    ) : null
                  }
                >
                  <Avatar sx={{ width: 36, height: 36 }} alt={user.displayName} src={user.avatar} />
                </Badge>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box
                    sx={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'text.primary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {user.displayName}
                  </Box>
                  {user.username && (
                    <Box
                      sx={{
                        fontSize: '12px',
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      @{user.username}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Popover>
    </Box>
  )
}

export default CardUserGroup
