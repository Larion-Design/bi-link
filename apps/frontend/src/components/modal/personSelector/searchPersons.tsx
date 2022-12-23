import React, { useCallback, useEffect, useState } from 'react'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import { searchPersonsRequest } from '../../../graphql/persons/queries/searchPersons'
import { useDebounce } from 'usehooks-ts'
import { PersonListRecord } from '../../../types/person'
import { PersonSelectorView } from './personSelector'
import { ModalHeader } from '../modalHeader'

type Props = {
  closeModal: () => void
  personsSelected?: (personsIds: string[]) => void
  excludedPersonsIds?: string[]
  changeView: (view: PersonSelectorView) => void
}

export const SearchPersons: React.FunctionComponent<Props> = ({
  closeModal,
  personsSelected,
  excludedPersonsIds,
  changeView,
}) => {
  const [searchPersons, { loading, error, data }] = searchPersonsRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedPersons, selectPersons] = useState<string[]>([])
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    void searchPersons({
      variables: {
        searchTerm: debouncedSearchTerm,
        skip: 0,
        limit: 10,
      },
    })
  }, [debouncedSearchTerm])

  const submitSelectedPersons = useCallback(() => {
    if (selectedPersons.length) {
      personsSelected?.(selectedPersons)
    }
    closeModal()
  }, [selectedPersons])

  return (
    <>
      <ModalHeader title={'Cauta persoane'} closeModal={closeModal} />
      <CardContent sx={{ height: 0.8, mb: 2 }}>
        <Box>
          <TextField
            fullWidth
            helperText={
              error?.message ??
              'Criteriile de cautare includ nume, prenume, CNP, date de contact, documente de identitate.'
            }
            onChange={({ target: { value } }) => setSearchTerm(value)}
            error={!!error}
          />
        </Box>

        <Box height={0.8} mt={2}>
          <DataGrid
            sx={{ width: 1 }}
            rows={
              data?.searchPersons?.records?.filter(
                ({ _id }) => !excludedPersonsIds?.includes(_id),
              ) ?? []
            }
            columns={columns}
            pageSize={5}
            checkboxSelection
            keepNonExistentRowsSelected
            onSelectionModelChange={(personsIds: GridSelectionModel) =>
              selectPersons((selectedPersons) =>
                Array.from(
                  new Set([...(personsIds as string[]), ...selectedPersons]),
                ),
              )
            }
            disableColumnSelector
            disableColumnFilter
            disableDensitySelector
            disableColumnMenu
            hideFooterPagination
            loading={loading}
            disableVirtualization
            getRowId={({ _id }: PersonListRecord) => _id}
            localeText={{
              noRowsLabel:
                'Nu au fost gasite persoane. Incearca alt termen de cautare.',
              footerRowSelected: (count) =>
                count !== 1
                  ? `${count} persoane selectate`
                  : '1 persoana selectata',
            }}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          startIcon={<PersonAddOutlinedIcon />}
          onClick={() => changeView('createPerson')}
        >
          Creaza persoana
        </Button>

        <Box display={'flex'}>
          <Button
            variant={'outlined'}
            color={'error'}
            onClick={closeModal}
            sx={{ mr: 2 }}
          >
            Inchide
          </Button>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={!selectedPersons.length}
            onClick={submitSelectedPersons}
          >
            Selectează
          </Button>
        </Box>
      </CardActions>
    </>
  )
}

const columns: GridColDef[] = [
  {
    field: '_id',
    headerName: 'ID',
    sortable: false,
    flex: 1.5,
  },
  {
    field: 'lastName',
    headerName: 'Nume',
    sortable: false,
    flex: 1,
  },
  {
    field: 'firstName',
    headerName: 'Prenume',
    sortable: false,
    flex: 1,
  },
  {
    field: 'cnp',
    headerName: 'CNP',
    sortable: false,
    flex: 1,
  },
]
