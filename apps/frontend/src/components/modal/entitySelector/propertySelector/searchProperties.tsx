import React, { useCallback, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDebounce } from 'usehooks-ts'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import { PropertySelectorView } from './propertySelector'
import { searchPropertiesRequest } from '@frontend/graphql/properties/queries/searchProperties'
import { PropertyListRecord } from 'defs'
import { ModalHeader } from '../../modalHeader'

type Props = {
  closeModal: () => void
  propertiesSelected?: (propertiesIds: string[]) => void
  excludedPropertiesIds?: string[]
  changeView: (view: PropertySelectorView) => void
}

export const SearchProperties: React.FunctionComponent<Props> = ({
  closeModal,
  propertiesSelected,
  excludedPropertiesIds,
  changeView,
}) => {
  const [properties, selectProperties] = useState<string[]>([])
  const [searchProperties, { loading, error, data }] = searchPropertiesRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    void searchProperties({
      variables: {
        searchTerm: debouncedSearchTerm,
        skip: 0,
        limit: 5,
      },
    })
  }, [debouncedSearchTerm])

  const submitSelectedProperties = useCallback(() => {
    if (properties.length) {
      propertiesSelected?.(properties)
    }
    closeModal()
  }, [properties])

  return (
    <>
      <ModalHeader title={'Cauta proprietati'} closeModal={closeModal} />
      <CardContent
        sx={{
          height: 0.8,
          mb: 2,
        }}
      >
        <Box>
          <TextField
            fullWidth
            helperText={
              error?.message ?? 'Criteriile de cautare includ nume sau tipul de proprietate.'
            }
            onChange={({ target: { value } }) => setSearchTerm(value)}
            error={!!error}
          />
        </Box>

        <Box height={0.8} mt={2}>
          <DataGrid
            sx={{ width: 1 }}
            rows={
              data?.searchProperties?.records?.filter(
                ({ _id }) => !excludedPropertiesIds?.includes(_id),
              ) ?? []
            }
            columns={columns}
            pageSize={5}
            checkboxSelection
            onSelectionModelChange={(propertiesIds: GridSelectionModel) =>
              selectProperties((selectedProperties) =>
                Array.from(new Set([...(propertiesIds as string[]), ...selectedProperties])),
              )
            }
            disableColumnSelector
            disableColumnFilter
            disableDensitySelector
            disableColumnMenu
            hideFooterPagination
            loading={loading}
            disableVirtualization
            getRowId={({ _id }: PropertyListRecord) => _id}
            localeText={{
              noRowsLabel: 'Nu au fost gasite proprietati. Incearca alt termen de cautare.',
              footerRowSelected: (count) =>
                count !== 1 ? `${count} proprietati selectate` : '1 proprietate selectata',
            }}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          startIcon={<AddOutlinedIcon />}
          onClick={() => changeView('createProperty')}
        >
          Creaza proprietate
        </Button>

        <Box display={'flex'}>
          <Button variant={'outlined'} color={'error'} onClick={closeModal} sx={{ mr: 2 }}>
            <FormattedMessage id={'close'} />
          </Button>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={!properties.length}
            onClick={submitSelectedProperties}
          >
            <FormattedMessage id={'select'} />
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
    flex: 1,
  },
  {
    field: 'name',
    headerName: 'Nume',
    sortable: false,
    flex: 1,
  },
  {
    field: 'type',
    headerName: 'Tip de proprietate',
    sortable: false,
    flex: 1,
  },
]
