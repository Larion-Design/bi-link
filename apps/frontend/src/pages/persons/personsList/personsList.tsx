import Stack from '@mui/material/Stack'
import React, { useEffect, useState } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'usehooks-ts'
import { DashboardPage } from '@frontend/components/page/DashboardPage'
import { routes } from '../../../router/routes'
import { PaginationParams } from 'api/shared/types/paginationParams'
import { PersonsTable } from './personsTable'
import { searchPersonsRequest } from '@frontend/graphql/persons/queries/searchPersons'
import { useNotification } from '@frontend/utils/hooks/useNotification'

export const PersonsList: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const notification = useNotification()
  const [fetchPersons, { data, error, loading }] = searchPersonsRequest()

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    currentPage: 0,
    itemsPerPage: 10000,
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
      notification('ServerError', 'error')
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Persoane'}>
      <Stack p={4} width={1} spacing={4}>
        <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant={'h5'} data-testid={'pageTitle'} flex={2}>
            Persoane
          </Typography>

          <Stack spacing={1} alignItems={'center'} direction={'row'} flex={8}>
            <TextField
              value={searchTerm}
              label={'Cauta persoane'}
              sx={{ flex: 12, mr: 2 }}
              size={'small'}
              onChange={({ target: { value } }) => {
                setSearchTerm(value)
                setPaginationParams((paginationParams) =>
                  paginationParams.currentPage
                    ? { ...paginationParams, currentPage: 0 }
                    : paginationParams,
                )
              }}
              data-testid={'searchPersonsInput'}
            />

            <Button
              variant={'contained'}
              onClick={() => navigate(routes.newPerson)}
              data-testid={'createPerson'}
            >
              <Tooltip title={'Creaza o persoana'}>
                <AddOutlinedIcon />
              </Tooltip>
            </Button>
          </Stack>
        </Stack>

        <PersonsTable
          paginationParams={paginationParams}
          setPaginationParams={setPaginationParams}
          persons={data?.searchPersons ?? { total: 0, records: [] }}
        />
      </Stack>
    </DashboardPage>
  )
}
