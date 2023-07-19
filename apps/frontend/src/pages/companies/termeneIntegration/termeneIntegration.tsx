import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { SearchTermeneForm } from '@frontend/components/form/integrations/termene/searchTermeneForm'
import { DashboardPage } from '@frontend/components/page/DashboardPage'
import { searchTermeneCompanies } from '@frontend/graphql/integrations/termene/queries/searchTermeneCompanies'
import { useNotification } from '@frontend/utils/hooks/useNotification'
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
          <SearchTermeneForm onSubmit={(searchTerm) => search({ variables: { searchTerm } })} />
        </Grid>
        <Grid item xs={12}>
          <TermeneCompaniesTable companies={data?.searchTermeneCompanies ?? []} />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
