import React, { useEffect } from 'react'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
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
      <Grid container spacing={2} sx={{ width: 1, p: 4 }}>
        <Grid item xs={12} mb={4}>
          <Grid container spacing={2} alignItems={'center'}>
            <Grid item xs={4}>
              <Typography variant={'h5'} data-cy={'pageTitle'}>
                Integrare{' '}
                <Link
                  underline={'always'}
                  color={'secondary'}
                  href={'https://termene.ro'}
                  target={'_blank'}
                  referrerPolicy={'no-referrer'}
                >
                  termene.ro
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <SearchTermeneForm onSubmit={(searchTerm) => search({ variables: { searchTerm } })} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TermeneCompaniesTable companies={data?.searchTermeneCompanies ?? []} />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
