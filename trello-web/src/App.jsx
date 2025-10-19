import Button from '@mui/material/Button'
import { useColorScheme } from '@mui/material/styles'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import Box from '@mui/material/Box'

function ModeSelect() {
  const { mode, setMode } = useColorScheme()
  const handleChange = (event) => {
    const newMode = event.target.value
    setMode(newMode)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >

        <MenuItem value="light">
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <LightModeIcon fontSize='small' /> Light
          </div>
        </MenuItem>
        <MenuItem value="dark">
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <DarkModeIcon fontSize='small' /> Dark
          </Box>
        </MenuItem>
        <MenuItem value="system">
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <SettingsBrightnessIcon fontSize='small' /> System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  )
}

function ModeToggle() {
  const { mode, setMode } = useColorScheme()

  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // console.log({ prefersDarkMode })
  // const prefersLightMode = useMediaQuery('(prefers-color-scheme: light)')
  // console.log({ prefersLightMode })


  return (
    <Button onClick={() => {
      setMode(mode === 'light' ? 'dark' : 'light')
    }}>
      Toggle to {mode === 'light' ? 'dark' : 'light'} mode
    </Button>
  )
}

function App() {
  return (
    <>
      <ModeSelect />
      <hr />
      <ModeToggle />
      <hr />
      <Button variant="contained">Hello World</Button>
    </>
  )
}

export default App
