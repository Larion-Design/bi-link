import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'usehooks-ts'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { routes } from '../../../router/routes'
import { useNotification } from '../../../utils/hooks/useNotification'
import { CompaniesTable } from './companiesTable'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { PaginationParams } from '../../../graphql/shared/types/paginationParams'
import { searchCompaniesRequest } from '../../../graphql/companies/queries/searchCompanies'

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
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            alignItems={'center'}
          >
            <Typography variant={'h5'} data-cy={'pageTitle'}>
              Companii
            </Typography>
            <Box display={'flex'} sx={{ width: 0.7 }}>
              <TextField
                value={searchTerm}
                label={'Cauta companii'}
                sx={{ flex: 12, mr: 2 }}
                onChange={({ target: { value } }) => setSearchTerm(value)}
                data-cy={'searchCompaniesInput'}
              />
              <Button
                variant={'contained'}
                sx={{ flex: 1 }}
                onClick={() => navigate(routes.newCompany)}
                data-cy={'createCompany'}
              >
                <Tooltip title={'Creaza o companie'}>
                  <AddOutlinedIcon />
                </Tooltip>
              </Button>
            </Box>
          </Box>
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
