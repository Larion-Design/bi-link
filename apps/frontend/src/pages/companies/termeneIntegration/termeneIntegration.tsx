import { SearchTermeneForm } from '@frontend/components/form/integrations/termene/searchTermeneForm'
import { DashboardPage } from '@frontend/components/page/DashboardPage'
import { searchTermeneCompanies } from '@frontend/graphql/integrations/termene/queries/searchTermeneCompanies'
import { useNotification } from '@frontend/utils/hooks/useNotification'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import React, { useEffect } from 'react'
import { TermeneCompaniesTable } from './termeneCompaniesTable'

export const TermeneIntegration: React.FunctionComponent = () => {
  const [search, { data, error }] = searchTermeneCompanies()
  const showNotification = useNotification()

  useEffect(() => {
    if (error) {
      showNotification('ServerError', 'error')
    }
  }, [error])

  return (
    <DashboardPage title={'Companii'}>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid item xs={12}>
          <SearchTermeneForm onSubmit={(name, cui) => void search({ variables: { name, cui } })} />
        </Grid>
        <Grid item xs={12}>
          <TermeneCompaniesTable companies={data?.searchTermeneCompanies ?? []} />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
