import React, { useCallback, useEffect, useState } from 'react'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import CardActions from '@mui/material/CardActions'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import { searchCompaniesRequest } from '../../../../graphql/companies/queries/searchCompanies'
import { useDebounce } from 'usehooks-ts'
import { CompanyListRecord } from 'defs'
import { CompanySelectorView } from './companySelector'
import { ModalHeader } from '../../modalHeader'

type Props = {
  closeModal: () => void
  companiesSelected?: (companiesIds: string[]) => void
  excludedCompaniesIds?: string[]
  changeView: (view: CompanySelectorView) => void
}

const columns: GridColDef[] = [
  {
    field: '_id',
    headerName: 'ID',
    sortable: false,
    flex: 1.5,
  },
  {
    field: 'name',
    headerName: 'Nume',
    sortable: false,
    flex: 1,
  },
  {
    field: 'cui',
    headerName: 'CIF / CUI',
    sortable: false,
    flex: 1,
  },
  {
    field: 'registrationNumber',
    headerName: 'Numar de inregistrare',
    sortable: false,
    flex: 1,
  },
]

export const SearchCompanies: React.FunctionComponent<Props> = ({
  closeModal,
  companiesSelected,
  excludedCompaniesIds,
  changeView,
}) => {
  const [companies, selectCompanies] = useState<string[]>([])
  const [searchCompanies, { loading, error, data }] = searchCompaniesRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    void searchCompanies({
      variables: {
        searchTerm: debouncedSearchTerm,
        skip: 0,
        limit: 10,
      },
    })
  }, [debouncedSearchTerm])

  const submitSelectedCompanies = useCallback(() => {
    if (companies.length) {
      companiesSelected?.(companies)
    }
    closeModal()
  }, [companies])

  return (
    <>
      <ModalHeader title={'Cauta companii'} closeModal={closeModal} />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
        <Box>
          <TextField
            fullWidth
            helperText={
              error?.message ??
              'Criteriile de cautare includ nume, CIF / CUI, numar de inregistrare, date de contact, adresa punctelor de lucru sau sediului social'
            }
            onChange={({ target: { value } }) => setSearchTerm(value)}
            error={!!error}
          />
        </Box>

        <Box height={0.8} mt={2}>
          <DataGrid
            sx={{ width: 1 }}
            rows={
              data?.searchCompanies?.records?.filter(
                ({ _id }) => !excludedCompaniesIds?.includes(_id),
              ) ?? []
            }
            columns={columns}
            pageSize={10}
            checkboxSelection
            onSelectionModelChange={(companiesIds: GridSelectionModel) =>
              selectCompanies((selectedCompanies) =>
                Array.from(new Set([...(companiesIds as string[]), ...selectedCompanies])),
              )
            }
            disableColumnSelector
            disableColumnFilter
            disableDensitySelector
            disableColumnMenu
            hideFooterPagination
            loading={loading}
            disableVirtualization
            getRowId={({ _id }: CompanyListRecord) => _id}
            localeText={{
              noRowsLabel: 'Nu au fost gasite companii. Incearca alt termen de cautare.',
              footerRowSelected: (count) =>
                count !== 1 ? `${count} companii selectate` : '1 companie selectata',
            }}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          startIcon={<AddOutlinedIcon />}
          onClick={() => changeView('createCompany')}
        >
          Creaza companie
        </Button>

        <Box display={'flex'}>
          <Button variant={'outlined'} color={'error'} onClick={closeModal} sx={{ mr: 2 }}>
            Inchide
          </Button>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={!companies.length}
            onClick={submitSelectedCompanies}
          >
            Selectează
          </Button>
        </Box>
      </CardActions>
    </>
  )
}
