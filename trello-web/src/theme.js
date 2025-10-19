
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: '#ff5252',
        },

      },
    },
    dark: {
      palette: {
        primary: {
          main: '#000',
        },

      },
    },
  },
  // ...other properties
});


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