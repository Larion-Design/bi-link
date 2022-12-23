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
import { searchPersonsRequest } from '../../../graphql/persons/queries/searchPersons'
import { routes } from '../../../router/routes'
import { PaginationParams } from '../../../graphql/shared/types/paginationParams'
import { PersonsTable } from './personsTable'
import { useSnackbar } from 'notistack'

export const PersonsList: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [fetchPersons, { data, error, loading }] = searchPersonsRequest()

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    currentPage: 0,
    itemsPerPage: 20,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const searchPersons = (searchTerm: string) => {
    if (!loading) {
      void fetchPersons({
        variables: {
          limit: paginationParams.itemsPerPage,
          skip: paginationParams.itemsPerPage * paginationParams.currentPage,
          searchTerm,
        },
      })
    }
  }
  useEffect(() => {
    searchPersons(debouncedSearchTerm)
  }, [debouncedSearchTerm, paginationParams])

  useEffect(() => {
    if (error?.message) {
      enqueueSnackbar('O eroare a intervenit in timpul comunicarii cu serverul.', {
        variant: 'error',
      })
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Persoane'}>
      <Grid container spacing={2} sx={{ width: 1, p: 4 }}>
        <Grid item xs={12} mb={4}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            flexWrap={'nowrap'}
            alignItems={'center'}
          >
            <Typography variant={'h5'} data-cy={'pageTitle'}>
              Persoane
            </Typography>
            <Box display={'flex'} sx={{ width: 0.7 }}>
              <TextField
                value={searchTerm}
                label={'Cauta persoane'}
                sx={{ flex: 12, mr: 2 }}
                onChange={({ target: { value } }) => {
                  setSearchTerm(value)
                  setPaginationParams((paginationParams) =>
                    paginationParams.currentPage
                      ? { ...paginationParams, currentPage: 0 }
                      : paginationParams,
                  )
                }}
                data-cy={'searchPersonsInput'}
              />
              <Button
                variant={'contained'}
                sx={{ flex: 1 }}
                onClick={() => navigate(routes.newPerson)}
                data-cy={'createPerson'}
              >
                <Tooltip title={'Creaza o persoana'}>
                  <AddOutlinedIcon />
                </Tooltip>
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <PersonsTable
            paginationParams={paginationParams}
            setPaginationParams={setPaginationParams}
            persons={data?.searchPersons ?? { total: 0, records: [] }}
          />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
