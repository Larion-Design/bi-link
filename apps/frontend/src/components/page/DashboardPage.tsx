import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import React, { PropsWithChildren } from 'react'
import { useLocalStorage } from 'usehooks-ts'

import { AppHeader } from './appBar'
import { Copyright } from './copyright'
import { AppDrawer } from './drawer'
import { Page } from './Page'

type Props = {
  title?: string
}

export const DashboardPage: React.FunctionComponent<
  PropsWithChildren<Props>
> = ({ children, title }) => {
  const [drawerVisibility, setDrawerVisibility] = useLocalStorage<boolean>(
    'drawerVisibility',
    true,
  )

  const toggleDrawer = () => setDrawerVisibility(!drawerVisibility)

  return (
    <Page title={title}>
      <AppHeader toggleDrawer={toggleDrawer} open={drawerVisibility} />
      <AppDrawer toggleDrawer={toggleDrawer} open={drawerVisibility} />
      <Box
        component={'main'}
        sx={{
          backgroundColor: ({ palette: { grey, mode } }) =>
            grey[mode === 'light' ? 100 : 900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth={'lg'} sx={{ mb: 2, mt: 4 }}>
          <Grid container spacing={4}>
            {children}
          </Grid>
          <Box sx={{ pt: 4 }}>
            <Copyright />
          </Box>
        </Container>
      </Box>
    </Page>
  )
}
