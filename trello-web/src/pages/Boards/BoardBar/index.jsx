import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Box from '@mui/material/Box'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLE = {
  color: 'primary.main',
  bgcolor: 'white',
  border: 'none',
  px: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': { color: 'primary.main' },
  '&:hover': { bgcolor: 'primary.50' },
}

function BoardBar() {
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      px: 2,
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      borderTop: '1px solid #00bfa5',
    }}>

      {/* Left side content */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardIcon />}
          label="Dashboard"
          // clickable
          onClick={() => { }}

        />
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          // clickable
          onClick={() => { }}

        />
        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label="Add to Google Drive"
          // clickable
          onClick={() => { }}

        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label="Automation"
          // clickable
          onClick={() => { }}
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label="Filter"
          // clickable
          onClick={() => { }}
        />
      </Box>

      {/* Right side content */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

        <Button variant="outlined" startIcon={<PersonAddIcon />}>
          Invite
        </Button>
        <AvatarGroup
          max={7}
          sx={{
            '& .MuiAvatar-root': { width: 32, height: 32, fontSize: 15 }
          }}
        >
          <Tooltip title="khang">
            <Avatar
              alt="khang"
              src="https://i.pravatar.cc/218"
            />
          </Tooltip>
          <Tooltip title="khang">
            <Avatar
              alt="khang"
              src="https://i.pravatar.cc/211"
            />
          </Tooltip>
          <Tooltip title="khang">
            <Avatar
              alt="khang"
              src="https://i.pravatar.cc/216"
            />
          </Tooltip>
          <Tooltip title="khang">
            <Avatar
              alt="khang"
              src="https://i.pravatar.cc/118"
            />
          </Tooltip>

        </AvatarGroup>
      </Box>

    </Box>
  )
}

export default BoardBar