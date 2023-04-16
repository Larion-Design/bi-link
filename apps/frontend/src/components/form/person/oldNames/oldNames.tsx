import React, { useCallback, useEffect, useState } from 'react'
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
import { GridSetItem, useGridSet } from '@frontend/utils/hooks/useGridSet'
import { FormattedMessage } from 'react-intl'
import { getDefaultOldName } from 'tools'
import { AddItemToolbarButton } from '../../../dataGrid/addItemToolbarButton'
import { RemoveRowsToolbarButton } from '../../../dataGrid/removeRowsToolbarButton'
import { Textarea } from '../../../dataGrid/textArea'

type Props<T = OldName> = {
  oldNames: T[]
  updateOldNames: (oldNames: T[]) => void | Promise<void>
}

export const OldNames: React.FunctionComponent<Props> = ({ oldNames, updateOldNames }) => {
  const { uid, values, rawValues, create, update, removeBulk } = useGridSet(oldNames)
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const removeSelectedRows = useCallback(
    () => removeBulk(selectedRows as string[]),
    [uid, selectedRows],
  )
  const addOldName = useCallback(() => create(getDefaultOldName()), [uid])

  useEffect(() => {
    void updateOldNames(rawValues())
  }, [uid])

  const processRowUpdate = useCallback(async (newRow: GridRowModel<GridSetItem<OldName>>) => {
    update(newRow)
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
        rows={values()}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={({ _id }) => _id}
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
