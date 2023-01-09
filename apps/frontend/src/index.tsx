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
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react'
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword'
import Session from 'supertokens-auth-react/recipe/session'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.1,
  })
}

SuperTokens.init({
  appInfo: {
    // learn more about this on https://supertokens.com/docs/emailpassword/appinfo
    appName: 'BI Link',
    apiDomain: import.meta.env.VITE_AUTH_BACKEND_API,
    websiteDomain: import.meta.env.VITE_AUTH_BACKEND_API,
    apiBasePath: '/auth',
  },
  recipeList: [EmailPassword.init(), Session.init()],
})

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
          <SuperTokensWrapper>
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
          </SuperTokensWrapper>
        </IntlProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
