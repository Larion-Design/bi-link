import React, { useEffect, useState } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'usehooks-ts'
import { DashboardPage } from '../../../components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { PaginationParams } from '../../../graphql/shared/types/paginationParams'
import { useSnackbar } from 'notistack'
import { IncidentsTable } from './incidentsTable'
import { searchIncidentsRequest } from '../../../graphql/incidents/queries/searchIncidents'

export const IncidentsList: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [fetchIncidents, { data, error, loading }] = searchIncidentsRequest()

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    currentPage: 0,
    itemsPerPage: 20,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const searchIncidents = () => {
    if (!loading) {
      void fetchIncidents({
        variables: {
          limit: paginationParams.itemsPerPage,
          skip: paginationParams.itemsPerPage * paginationParams.currentPage,
          searchTerm: debouncedSearchTerm,
        },
      })
    }
  }

  useEffect(() => {
    setPaginationParams((paginationParams) => {
      if (paginationParams.currentPage !== 0) {
        return {
          ...paginationParams,
          currentPage: 0,
        }
      }
      return paginationParams
    })

    searchIncidents()
  }, [debouncedSearchTerm])

  useEffect(() => {
    searchIncidents()
  }, [paginationParams])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Incidente'}>
      <Grid container spacing={2} sx={{ width: 1, p: 4 }}>
        <Grid item xs={12} mb={4}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            alignItems={'center'}
          >
            <Typography variant={'h5'} data-cy={'pageTitle'}>
              Incidente
            </Typography>
            <Box display={'flex'} sx={{ width: 0.7 }}>
              <TextField
                value={searchTerm}
                label={'Cauta incidente'}
                sx={{ flex: 12, mr: 2 }}
                onChange={({ target: { value } }) => setSearchTerm(value)}
                data-cy={'searchIncidentsInput'}
              />
              <Button
                variant={'contained'}
                sx={{ flex: 1 }}
                onClick={() => navigate(routes.newIncident)}
                data-cy={'createIncident'}
              >
                <Tooltip title={'Creaza un incident'}>
                  <AddOutlinedIcon />
                </Tooltip>
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <IncidentsTable
            paginationParams={paginationParams}
            setPaginationParams={setPaginationParams}
            incidents={data?.searchIncidents ?? { records: [], total: 0 }}
          />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
