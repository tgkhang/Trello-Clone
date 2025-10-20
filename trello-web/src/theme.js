import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  trello: {
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secondary: deepOrange
      },
    },
    dark: {
      palette: {
        primary: cyan,
        secondary: orange
      },
    },
  },
  cssVariables: true,
  colorSchemeSelector: 'class'
})


// import { createTheme } from '@mui/material/styles'
// import { red } from '@mui/material/colors'

// Create a theme instance.
// const theme = extendTheme({
//   cssVariables: true,
//   palette: {
//     mode: 'light', // default
//     primary: {
//       main: '#556cd6',
//     },
//     secondary: {
//       main: '#19857b',
//     },
//     error: {
//       main: red.A400,
//     },
//   },
// })

export default theme