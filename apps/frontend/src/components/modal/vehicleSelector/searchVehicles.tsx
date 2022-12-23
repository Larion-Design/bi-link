import React, { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import { VehicleSelectorView } from './vehicleSelector'
import { searchVehiclesRequest } from '../../../graphql/vehicles/queries/searchVehicles'
import { VehicleListRecord } from '../../../types/vehicle'

type Props = {
  closeModal: () => void
  vehiclesSelected?: (vehiclesIds: string[]) => void
  excludedVehiclesIds?: string[]
  changeView: (view: VehicleSelectorView) => void
}

export const SearchVehicles: React.FunctionComponent<Props> = ({
  closeModal,
  vehiclesSelected,
  excludedVehiclesIds,
  changeView,
}) => {
  const [vehicles, selectVehicles] = useState<string[]>([])
  const [searchVehicles, { loading, error, data }] = searchVehiclesRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    void searchVehicles({
      variables: {
        searchTerm: debouncedSearchTerm,
        skip: 0,
        limit: 5,
      },
    })
  }, [debouncedSearchTerm])

  const submitSelectedVehicles = useCallback(() => {
    if (vehicles.length) {
      vehiclesSelected?.(vehicles)
    }
    closeModal()
  }, [vehicles])

  return (
    <>
      <CardHeader
        title={'Cauta vehicule'}
        action={
          <IconButton title={'Inchide'} onClick={closeModal}>
            <CloseOutlinedIcon color={'error'} />
          </IconButton>
        }
      />
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
              error?.message ??
              'Criteriile de cautare includ VIN, marca sau modelul vehiculului.'
            }
            onChange={({ target: { value } }) => setSearchTerm(value)}
            error={!!error}
          />
        </Box>

        <Box height={0.8} mt={2}>
          <DataGrid
            sx={{ width: 1 }}
            rows={
              data?.searchVehicles?.records?.filter(
                ({ _id }) => !excludedVehiclesIds?.includes(_id),
              ) ?? []
            }
            columns={columns}
            pageSize={5}
            checkboxSelection
            onSelectionModelChange={(vehiclesIds: GridSelectionModel) =>
              selectVehicles((selectedVehicles) =>
                Array.from(
                  new Set([...(vehiclesIds as string[]), ...selectedVehicles]),
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
            getRowId={({ _id }: VehicleListRecord) => _id}
            localeText={{
              noRowsLabel:
                'Nu au fost gasite vehicule. Incearca alt termen de cautare.',
              footerRowSelected: (count) =>
                count !== 1
                  ? `${count} vehicule selectate`
                  : '1 vehicul selectat',
            }}
          />
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          startIcon={<AddOutlinedIcon />}
          onClick={() => changeView('createVehicle')}
        >
          Creaza vehicul
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
            disabled={!!vehicles.length}
            onClick={submitSelectedVehicles}
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
    flex: 1,
  },
  {
    field: 'vin',
    headerName: 'VIN',
    sortable: false,
    flex: 1,
  },
  {
    field: 'maker',
    headerName: 'Marca',
    sortable: false,
    flex: 1,
  },
  {
    field: 'model',
    headerName: 'Model',
    sortable: false,
    flex: 1,
  },
]
