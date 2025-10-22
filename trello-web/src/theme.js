// import { cyan, deepOrange, orange, teal } from '@mui/material/colors'
import { extendTheme } from '@mui/material/styles'

const theme = extendTheme({
  colorSchemeSelector: 'class',
  defaultColorScheme: 'light',
  trello: {
    appBarHeight: '58px',
    boardBarHeight: '60px'
  },
  colorSchemes: {
    light: {
      // palette: {
      //   primary: teal,
      //   secondary: deepOrange
      // },
    },
    dark: {
      // palette: {
      //   primary: cyan,
      //   secondary: orange
      // },
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': { width: '8px', height: '8px' },
          '*::-webkit-scrollbar-thumb': { backgroundColor: '#dcdde1', borderRadius: '8px' },
          '*::-webkit-scrollbar-thumb:hover': { backgroundColor: 'white' },
        },
      },
    },
    // Customize MUI Button component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          //fontSize: '1rem',
          textTransform: 'none',
          borderWidth: '0.5px',
          ':&hover': { borderWidth: '0.5px', }
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          // color: theme.palette.primary.main,
          fontsize: '0.875rem',
        }
      },
    },
    // customize MUI TextField component
    MuiOutlinedInput: {
      styleOverrides: {
        // override the styles of the root element
        root: {
          // color: theme.palette.primary.main,
          fontsize: '0.875rem',
          // '.MuiOutlinedInput-notchedOutline': {
          //   borderColor: theme.palette.primary.light,
          // },
          // '&:hover .MuiOutlinedInput-notchedOutline': {
          //   '.MuiOutlinedInput-notchedOutline': {
          //     borderColor: theme.palette.primary.light,
          //   },
          // },
          '& fieldset': {
            borderWidth: '0.5px !important',
          },
          '&:hover fieldset': {
            borderWidth: '1px !important',
          },
          '&.Mui-focused fieldset': {
            borderWidth: '1px !important',
          },
        }

      }
    },
  },
  // Other theme properties...
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