import { createDatagridItems, getDatagridItemInfo, Unique } from '@frontend/utils/datagridHelpers'
import React, { useCallback, useMemo, useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import { OldName } from 'defs'
import { processGridCellValue } from '@frontend/utils/dataGrid'
import { FormattedMessage } from 'react-intl'
import { usePersonState } from 'state/personState'
import { AddItemToolbarButton } from '../../../dataGrid/addItemToolbarButton'
import { RemoveRowsToolbarButton } from '../../../dataGrid/removeRowsToolbarButton'
import { Textarea } from '../../../dataGrid/textArea'

export const OldNames: React.FunctionComponent = () => {
  const [oldNames, updateOldName, removeOldNames, addOldName] = usePersonState(
    ({ oldNames, updateOldName, removeOldNames, addOldName }) => [
      oldNames,
      updateOldName,
      removeOldNames,
      addOldName,
    ],
  )
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const removeSelectedRows = useCallback(
    () => removeOldNames(selectedRows as string[]),
    [selectedRows, removeOldNames],
  )

  const datagridOldNames = useMemo(() => createDatagridItems(oldNames), [oldNames])

  const processRowUpdate = useCallback(async (newRow: GridRowModel<Unique<OldName>>) => {
    const { id, item } = getDatagridItemInfo(newRow)
    updateOldName(id, item)
    return Promise.resolve(newRow)
  }, [])

  return (
    <Box sx={{ minHeight: '50vh', maxHeight: '100vh', mt: 5 }}>
      <Typography variant={'h6'} sx={{ mb: 3 }}>
        <FormattedMessage id={'Old Names'} />
      </Typography>
      <DataGrid
        autoHeight
        checkboxSelection
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableVirtualization
        disableSelectionOnClick
        disableIgnoreModificationsIfProcessingProps
        hideFooterSelectedRowCount
        hideFooterPagination
        hideFooter
        rows={datagridOldNames}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={processRowUpdate}
        onSelectionModelChange={(selectedRows) => setSelectedRows(selectedRows)}
        components={{
          Toolbar: () => (
            <GridToolbarContainer sx={{ p: 2 }}>
              <AddItemToolbarButton onClick={addOldName} />

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

const columns: GridColDef[] = [
  {
    field: 'name',
    headerName: 'Nume',
    editable: true,
    type: 'string',
    flex: 1,
  },
  {
    field: 'changeReason',
    headerName: 'Motivul schimbarii numelui',
    flex: 2,
    editable: true,
    type: 'string',
    renderEditCell: Textarea,
    preProcessEditCellProps: processGridCellValue,
  },
]
