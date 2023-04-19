import React, { useCallback, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { LocationAPIInput } from 'defs'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowModel,
  GridRowParams,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import Box from '@mui/material/Box'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { createDatagridItems, getDatagridItemInfo, Unique } from '@frontend/utils/datagridHelpers'
import { RemoveRowsToolbarButton } from '../../dataGrid/removeRowsToolbarButton'
import { AddItemToolbarButton } from '../../dataGrid/addItemToolbarButton'

type Props<T = LocationAPIInput> = {
  locations: Map<string, T>
  updateLocation: (uid: string, locations: T) => void
  addLocation: () => void
  removeLocations: (ids: string[]) => void
}

export const Locations: React.FunctionComponent<Props> = ({
  locations,
  updateLocation,
  addLocation,
  removeLocations,
}) => {
  const intl = useIntl()
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const datagridItems = useMemo(() => createDatagridItems(locations), [locations])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<Unique<LocationAPIInput>>) => {
      const { id, item } = getDatagridItemInfo(newRow)
      updateLocation(id, item)
      return Promise.resolve(newRow)
    },
    [updateLocation],
  )

  const removeSelectedRows = useCallback(
    () => removeLocations(selectedRows as string[]),
    [selectedRows, removeLocations],
  )

  const columns: Array<GridColDef | GridActionsColDef> = useMemo(
    () => [
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
    ],
    [intl],
  )

  return (
    <Box sx={{ minHeight: '50vh', maxHeight: '100vh', width: 1 }}>
      <DataGrid
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        disableIgnoreModificationsIfProcessingProps
        hideFooterPagination
        rows={datagridItems}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
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
