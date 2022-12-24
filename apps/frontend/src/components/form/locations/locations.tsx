import React, { useCallback, useEffect, useState } from 'react'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import Box from '@mui/material/Box'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { Location, LocationAPIInput } from 'defs'
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
import { GridSetItem, useGridSet } from '../../../utils/hooks/useGridSet'
import { RemoveRowsToolbarButton } from '../../dataGrid/removeRowsToolbarButton'
import { Textarea } from '../../dataGrid/textArea'
import { AddItemToolbarButton } from '../../dataGrid/addItemToolbarButton'

type Props = {
  locations: Location[]
  updateLocations: (locations: Location[]) => void | Promise<void>
}

export const Locations: React.FunctionComponent<Props> = ({ locations, updateLocations }) => {
  const { uid, values, update, removeBulk, create, rawValues } = useGridSet(locations)

  useEffect(() => {
    updateLocations(rawValues())
  }, [uid])

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<GridSetItem<LocationAPIInput>>) => {
      update(newRow)
      return Promise.resolve(newRow)
    },
    [],
  )

  const removeSelectedRows = useCallback(() => removeBulk(selectedRows as string[]), [selectedRows])

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
              <AddItemToolbarButton
                onClick={() =>
                  create({
                    address: '',
                    isActive: true,
                  })
                }
              />

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

const columns: Array<GridColDef | GridActionsColDef> = [
  {
    field: 'address',
    headerName: 'Adresa',
    editable: true,
    type: 'string',
    flex: 1,
    renderEditCell: Textarea,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      if (params.hasChanged) {
        const hasError = !params.props.value.length
        return { ...params.props, error: hasError }
      }
      return params
    },
  },
  {
    field: 'isActive',
    headerName: 'Deschis?',
    flex: 1,
    editable: true,
    type: 'boolean',
  },
  {
    field: 'actions',
    headerName: 'Actiuni',
    flex: 1,
    type: 'actions',
    getActions: ({ row: { address } }: GridRowParams<LocationAPIInput>) => [
      <GridActionsCellItem
        showInMenu={false}
        icon={<MapOutlinedIcon />}
        label={'Vezi pe harta'}
        disabled
      />,
    ],
  },
]
