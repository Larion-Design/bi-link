import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useSnackbar } from 'notistack'
import { DashboardPage } from '../../components/page/DashboardPage'
import { getUsersRequest } from '../../graphql/users/queries/getUsers'
import { UsersTable } from './usersTable'

export const UsersList: React.FunctionComponent = () => {
  const { data, error } = getUsersRequest()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Utilizatori'}>
      <Grid container spacing={2} sx={{ width: 1, p: 4 }}>
        <Grid item xs={12} mb={4}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            alignItems={'center'}
          >
            <Typography variant={'h5'} data-cy={'pageTitle'}>
              Utilizatori
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <UsersTable users={data?.getUsers ?? []} />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
