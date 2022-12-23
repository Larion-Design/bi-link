import 'tslib'
import React from 'react'
import ReactDOM from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { apolloClient } from './graphql/apolloClient'
import { ApolloProvider } from '@apollo/client'
import { IntlProvider } from 'react-intl'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import roRO from 'date-fns/locale/ro'
import { Router } from './router/router'
import localeRo from './locale/ro.json'
import { BrowserTracing } from '@sentry/tracing'
import { SnackbarProvider } from 'notistack'
import { ModalProvider } from './components/modal/modalProvider'
import { DialogProvider } from './components/dialog/dialogProvider'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.1,
  })
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider
        dateAdapter={AdapterDateFns}
        adapterLocale={roRO}
        localeText={{
          cancelButtonLabel: 'Inchide',
          okButtonLabel: 'Salvează',
        }}
      >
        <IntlProvider messages={localeRo} locale={'ro'} defaultLocale={'ro'}>
          <ApolloProvider client={apolloClient}>
            <SnackbarProvider
              maxSnack={5}
              autoHideDuration={3000}
              preventDuplicate
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <ModalProvider>
                <DialogProvider>
                  <Router />
                </DialogProvider>
              </ModalProvider>
            </SnackbarProvider>
          </ApolloProvider>
        </IntlProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
