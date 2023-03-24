import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDebounce } from 'usehooks-ts'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useNotification } from '@frontend/utils/hooks/useNotification'
import { routes } from '../../../router/routes'
import { DashboardPage } from '@frontend/components/page/DashboardPage'
import { searchProceedingsRequest } from '@frontend/graphql/proceedings/queries/searchProceedings'
import { PaginationParams } from '@frontend/graphql/shared/types/paginationParams'
import { ProceedingsTable } from './proceedingsTable'

export const ProceedingsList: React.FunctionComponent = () => {
  const navigate = useNavigate()
  const notification = useNotification()
  const [searchProceedings, { data, loading, error }] = searchProceedingsRequest()

  const [paginationParams, setPaginationParams] = useState<PaginationParams>({
    currentPage: 0,
    itemsPerPage: 20,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  const search = (searchTerm: string) => {
    if (!loading) {
      void searchProceedings({
        variables: {
          limit: paginationParams.itemsPerPage,
          skip: paginationParams.itemsPerPage * paginationParams.currentPage,
          searchTerm,
        },
      })
    }
  }

  useEffect(() => {
    search(debouncedSearchTerm)
  }, [debouncedSearchTerm, paginationParams])

  useEffect(() => {
    if (error?.message) {
      notification('ServerError', 'error')
    }
  }, [error?.message])

  return (
    <DashboardPage title={'Procese juridice'}>
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
                label={'Cauta procese juridice'}
                sx={{ flex: 12, mr: 2 }}
                onChange={({ target: { value } }) => {
                  setSearchTerm(value)
                  setPaginationParams((paginationParams) =>
                    paginationParams.currentPage
                      ? { ...paginationParams, currentPage: 0 }
                      : paginationParams,
                  )
                }}
                data-cy={'searchProceedingsInput'}
              />
              <Button
                variant={'contained'}
                sx={{ flex: 1 }}
                onClick={() => navigate(routes.newProceeding)}
                data-cy={'createProceeding'}
              >
                <Tooltip title={'Creaza un proces juridic'}>
                  <AddOutlinedIcon />
                </Tooltip>
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ProceedingsTable
            paginationParams={paginationParams}
            setPaginationParams={setPaginationParams}
            proceedings={data?.searchProceedings ?? { total: 0, records: [] }}
          />
        </Grid>
      </Grid>
    </DashboardPage>
  )
}
