// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '~/index.css'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
// import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material/styles'
import theme from '~/theme.js'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import { ConfirmProvider } from 'material-ui-confirm'

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
    <ConfirmProvider defaultOptions={{
      dialogActionsProps: { maxWidth: 'xs' },
      confirmationButtonProps: { variant:'outlined' },
      cancellationButtonProps: { color:'inherit' },
      buttonOrder: ['confirm', 'cancel']
    }}>
      <CssBaseline enableColorScheme />
      <App />
      {/* Init ToastContainer */}
      <ToastContainer position='bottom-right' theme='colored' />
    </ConfirmProvider>
  </ThemeProvider>
)
