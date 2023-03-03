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
import { EventsTable } from './eventsTable'
import { searchEventsRequest } from '../../../graphql/events/queries/searchEvents'

export const EventsList: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [fetchEvents, { data, error, loading }] = searchEventsRequest()

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    currentPage: 0,
    itemsPerPage: 20,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const searchEvents = () => {
    if (!loading) {
      void fetchEvents({
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

    searchEvents()
  }, [debouncedSearchTerm])

  useEffect(() => {
    searchEvents()
  }, [paginationParams])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Evente'}>
      <Grid container spacing={2} sx={{ width: 1, p: 4 }}>
        <Grid item xs={12} mb={4}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            alignItems={'center'}
          >
            <Typography variant={'h5'} data-cy={'pageTitle'}>
              Evenimente
            </Typography>
            <Box display={'flex'} sx={{ width: 0.7 }}>
              <TextField
                value={searchTerm}
                label={'Cauta evenimente'}
                sx={{ flex: 12, mr: 2 }}
                onChange={({ target: { value } }) => setSearchTerm(value)}
                data-cy={'searchEventsInput'}
              />
              <Button
                variant={'contained'}
                sx={{ flex: 1 }}
                onClick={() => navigate(routes.newEvent)}
                data-cy={'createEvent'}
              >
                <Tooltip title={'Creaza un eveniment'}>
                  <AddOutlinedIcon />
                </Tooltip>
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <EventsTable
            paginationParams={paginationParams}
            setPaginationParams={setPaginationParams}
            events={data?.searchEvents ?? { records: [], total: 0 }}
          />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
