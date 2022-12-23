import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { ErrorBoundary } from '@sentry/react'
import React, { PropsWithChildren } from 'react'
import { Helmet } from 'react-helmet'

type Props = {
  title?: string
}

export const Page: React.FunctionComponent<PropsWithChildren<Props>> = ({
  title,
  children,
}) => (
  <ErrorBoundary showDialog={true}>
    <Box display={'flex'}>
      <Helmet title={title ? `BI Link | ${title}` : 'BI Link'} />
      <CssBaseline />
      {children}
    </Box>
  </ErrorBoundary>
)
