import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Box from '@mui/material/Box'
import PersonIcon from '@mui/icons-material/Person'
import SecurityIcon from '@mui/icons-material/Security'
import AccountTab from './AccountTab'
import SecurityTab from './SecurityTab'

const TABS = {
  ACCOUNT: 'account',
  SECURITY: 'security',
}

function Settings() {
  const location = useLocation()

  const getTabDefault = () => {
    if (location.pathname.includes(TABS.ACCOUNT)) return TABS.ACCOUNT
    return TABS.SECURITY
  }

  const [activeTab, setActiveTab] = useState(getTabDefault())

  const handleTabChange = (event, selectedTab) => {
    setActiveTab(selectedTab)
  }

  return (
    <Container disableGutters maxWidth="false">
      <AppBar />
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            <Tab
              label="Account"
              value={TABS.ACCOUNT}
              icon={<PersonIcon />}
              iconPosition="start"
              to="/settings/account"
              component={Link}
            />
            <Tab
              label="Security"
              value={TABS.SECURITY}
              icon={<SecurityIcon />}
              iconPosition="start"
              to="/settings/security"
              component={Link}
            />
          </TabList>
        </Box>
        <TabPanel value={TABS.ACCOUNT}>
          <AccountTab />
        </TabPanel>
        <TabPanel value={TABS.SECURITY}>
          <SecurityTab />
        </TabPanel>
      </TabContext>
    </Container>
  )
}

export default Settings
