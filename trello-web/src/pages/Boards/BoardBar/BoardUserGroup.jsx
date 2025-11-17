import { useState } from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Popover from '@mui/material/Popover'

function BoardUserGroup({ boardUsers = [], limit = 4 }) {
  const [anchorPopOverElement, setAnchorPopOverElement] = useState(null)
  const isOpenPopOver = Boolean(anchorPopOverElement)
  const popoverId = isOpenPopOver ? 'board-all-users-popover' : undefined

  const handleTogglePopOver = (event) => {
    if (!anchorPopOverElement) {
      setAnchorPopOverElement(event.currentTarget)
    } else setAnchorPopOverElement(null)
  }

  return (
    <Box sx={{ display: 'flex', gap: '4px' }}>
      {/* Display limited number of users based on the limit */}
      {boardUsers.map((user, index) => {
        if (index < limit) {
          return (
            <Tooltip title={user?.displayName} key={user?._id || index}>
              <Avatar sx={{ width: 34, height: 34, cursor: 'pointer' }} alt={user?.displayName} src={user?.avatar} />
            </Tooltip>
          )
        }
        return null
      })}

      {/* if number of user exceeds limit, show +n and popover */}
      {boardUsers.length > limit && (
        <>
          <Tooltip title="Show more">
            <Box
              aria-describedby={popoverId}
              onClick={handleTogglePopOver}
              sx={{
                width: 36,
                height: 36,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '50%',
                color: 'white',
                backgroundColor: '#a4b0be',
              }}
            >
              +{boardUsers.length - limit}
            </Box>
          </Tooltip>

          {/* Display all users in a popover */}
          <Popover
            id={popoverId}
            open={isOpenPopOver}
            anchorEl={anchorPopOverElement}
            onClose={handleTogglePopOver}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ p: 2, display: 'flex', maxWidth: '234px', flexWrap: 'wrap', gap: 1 }}>
              {boardUsers.map((user, index) => (
                <Tooltip title={user?.displayName} key={user?._id || index}>
                  <Avatar
                    sx={{ width: 34, height: 34, cursor: 'pointer' }}
                    alt={user?.displayName}
                    src={user?.avatar}
                  />
                </Tooltip>
              ))}
            </Box>
          </Popover>
        </>
      )}
    </Box>
  )
}

export default BoardUserGroup
