import React from 'react'
import { Typography } from '@mui/material'
import { DashboardPage } from '../components/page/DashboardPage'
import Container from '@mui/material/Container'

export const InvalidPage: React.FunctionComponent = () => (
  <DashboardPage title={'Pagina invalida sau inexistenta'}>
    <Container sx={{ p: 5 }}>
      <Typography variant={'h5'} textAlign={'center'}>
        Pagina pe care ai incercat sa o accesezi nu exista sau este invalida.
      </Typography>
    </Container>
  </DashboardPage>
)
