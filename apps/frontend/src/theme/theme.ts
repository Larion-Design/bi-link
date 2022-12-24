// noinspection ES6UnusedImports

import { createTheme } from '@mui/material'
import {} from '@mui/lab/themeAugmentation'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#31314b',
    },
    secondary: {
      main: '#b89595',
      contrastText: '#ffcc00',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    success: {
      main: 'rgba(82,166,63,0.8)',
    },
    error: {
      main: 'rgba(185,36,61,0.8)',
    },
    action: {},
  },
  components: {
    MuiTimeline: {
      styleOverrides: {
        root: {},
      },
    },
    MuiButton: {
      defaultProps: {
        tabIndex: -1,
        disableElevation: true,
      },
    },
    MuiIconButton: {
      defaultProps: {
        tabIndex: -1,
        disableRipple: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: { shrink: true },
      },
    },
    MuiModal: {
      defaultProps: {
        sx: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
    },
    MuiLink: {
      defaultProps: {
        sx: { textDecoration: 'none' },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
})
