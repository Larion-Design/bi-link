import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { v4 } from 'uuid'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import Box from '@mui/material/Box'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { LocationAPIInput } from 'defs'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRowModel,
  GridRowParams,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import { GridSetItem } from '../../../utils/hooks/useGridSet'
import { useDebouncedMap } from '../../../utils/hooks/useMap'
import { RemoveRowsToolbarButton } from '../../dataGrid/removeRowsToolbarButton'
import { AddItemToolbarButton } from '../../dataGrid/addItemToolbarButton'

type Props = {
  locations: LocationAPIInput[]
  updateLocations: (locations: LocationAPIInput[]) => void | Promise<void>
}

export const Locations: React.FunctionComponent<Props> = ({ locations, updateLocations }) => {
  const intl = useIntl()
  const { uid, values, update, removeBulk, add } = useDebouncedMap(
    1000,
    locations,
    ({ locationId }) => locationId,
  )

  useEffect(() => {
    void updateLocations(values())
  }, [uid])

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<GridSetItem<LocationAPIInput>>) => {
      update(newRow.locationId, newRow)
      return Promise.resolve(newRow)
    },
    [uid],
  )

  const removeSelectedRows = useCallback(() => removeBulk(selectedRows as string[]), [selectedRows])

  const addLocation = useCallback(
    () =>
      add({
        locationId: v4(),
        building: '',
        coordinates: {
          lat: 0,
          long: 0,
        },
        country: '',
        county: '',
        door: '',
        locality: '',
        number: '',
        otherInfo: '',
        street: '',
        zipCode: '',
      }),
    [uid],
  )

  const columns: Array<GridColDef | GridActionsColDef> = useMemo(() => {
    const processCellValue = (params: GridPreProcessEditCellProps<string>) => {
      if (params.hasChanged) {
        const hasError = !params.props.value?.length
        return { ...params.props, error: hasError }
      }
      return params
    }

    return [
      ...(
        [
          'street',
          'number',
          'building',
          'door',
          'locality',
          'county',
          'zipCode',
          'country',
          'otherInfo',
        ] as Array<keyof LocationAPIInput>
      ).map((field) => ({
        field,
        headerName: intl.formatMessage({ id: field }),
        editable: true,
        type: 'string',
        flex: 1,
      })),
      {
        field: 'actions',
        headerName: intl.formatMessage({ id: 'actions' }),
        flex: 1,
        type: 'actions',
        getActions: ({
          row: {
            coordinates: { lat, long },
          },
        }: GridRowParams<LocationAPIInput>) => [
          <GridActionsCellItem
            showInMenu={true}
            icon={<MapOutlinedIcon />}
            label={'Vezi pe harta'}
            disabled={lat === 0 && long === 0}
          />,
        ],
      },
    ]
  }, [intl])

  return (
    <Box sx={{ minHeight: '50vh', maxHeight: '100vh', width: 1 }}>
      <DataGrid
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        disableIgnoreModificationsIfProcessingProps
        hideFooterPagination
        rows={values()}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={({ _id }) => _id}
        processRowUpdate={processRowUpdate}
        onSelectionModelChange={(selectedRows) => setSelectedRows(selectedRows)}
        components={{
          Toolbar: () => (
            <GridToolbarContainer sx={{ p: 2 }}>
              <AddItemToolbarButton onClick={addLocation} />

              {!!selectedRows.length && (
                <RemoveRowsToolbarButton onRemovalConfirmed={removeSelectedRows} />
              )}
            </GridToolbarContainer>
          ),
        }}
        localeText={{
          noRowsLabel: 'Nu ai adăugat nicio informatie.',
          footerRowSelected: () => '',
        }}
      />
    </Box>
  )
}
