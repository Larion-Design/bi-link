import Stack from '@mui/material/Stack'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'usehooks-ts'
import { useNotification } from '@frontend/utils/hooks/useNotification'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { searchCompaniesRequest } from '../../../graphql/companies/queries/searchCompanies'
import { PaginationParams } from '../../../graphql/shared/types/paginationParams'
import { routes } from '../../../router/routes'
import { CompaniesTable } from './companiesTable'

export const CompaniesList: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const [fetchCompanies, { data, loading, error }] = searchCompaniesRequest()
  const showNotification = useNotification()
  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    currentPage: 0,
    itemsPerPage: 20,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm)

  useEffect(() => {
    setPaginationParams((paginationParams) => {
      if (paginationParams.currentPage > 0) {
        return { ...paginationParams, currentPage: 0 }
      }
      return paginationParams
    })
  }, [debouncedSearchTerm])

  useEffect(() => {
    if (!loading) {
      void fetchCompanies({
        variables: {
          limit: paginationParams.itemsPerPage,
          skip: paginationParams.itemsPerPage * paginationParams.currentPage,
          searchTerm: debouncedSearchTerm,
        },
      })
    }
  }, [paginationParams, debouncedSearchTerm])

  useEffect(() => {
    if (error?.message) {
      showNotification('O eroare a intervenit in timpul comunicarii cu serverul.', 'error')
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Companii'}>
      <Grid container spacing={2} sx={{ width: 1, p: 4 }}>
        <Grid item xs={12} mb={4}>
          <Grid container spacing={1} alignItems={'center'}>
            <Grid item xs={2}>
              <Typography variant={'h5'} data-cy={'pageTitle'}>
                Companii
              </Typography>
            </Grid>

            <Grid item xs={8}>
              <TextField
                fullWidth
                size={'small'}
                value={searchTerm}
                label={'Cauta companii'}
                onChange={({ target: { value } }) => setSearchTerm(value)}
                data-cy={'searchCompaniesInput'}
              />
            </Grid>

            <Grid item xs={1}>
              <Stack spacing={1} direction={'row'}>
                <Button
                  size={'medium'}
                  variant={'contained'}
                  onClick={() => navigate(routes.newCompany)}
                  data-cy={'createCompany'}
                >
                  <Tooltip title={'Creaza o companie'}>
                    <AddOutlinedIcon />
                  </Tooltip>
                </Button>

                <Button
                  size={'medium'}
                  variant={'contained'}
                  onClick={() => navigate(routes.companiesIntegrationTermene)}
                  data-cy={'createCompany'}
                >
                  <Tooltip title={'Cauta companii pe termene.ro'}>
                    <LanguageOutlinedIcon />
                  </Tooltip>
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <CompaniesTable
            paginationParams={paginationParams}
            setPaginationParams={setPaginationParams}
            companies={data?.searchCompanies ?? { total: 0, records: [] }}
          />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
