import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import React, { useCallback, useEffect, useState } from 'react'
import { OldNameAPIInput } from 'defs'
import { processGridCellValue } from '../../../utils/dataGrid'
import { GridSetItem, useGridSet } from '../../../utils/hooks/useGridSet'
import { AddItemToolbarButton } from '../../dataGrid/addItemToolbarButton'
import { RemoveRowsToolbarButton } from '../../dataGrid/removeRowsToolbarButton'
import { Textarea } from '../../dataGrid/textArea'

type Props = {
  oldNames: OldNameAPIInput[]
  updateOldNames: (oldNames: OldNameAPIInput[]) => void | Promise<void>
}

export const OldNames: React.FunctionComponent<Props> = ({ oldNames, updateOldNames }) => {
  const { uid, values, rawValues, create, update, removeBulk } = useGridSet(oldNames)
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const removeSelectedRows = useCallback(
    () => removeBulk(selectedRows as string[]),
    [uid, selectedRows],
  )
  const addOldName = useCallback(() => create({ name: '', changeReason: '' }), [uid])

  useEffect(() => {
    void updateOldNames(rawValues())
  }, [uid])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<GridSetItem<OldNameAPIInput>>) => {
      update(newRow)
      return Promise.resolve(newRow)
    },
    [],
  )

  return (
    <Box sx={{ minHeight: '50vh', maxHeight: '100vh' }}>
      <Typography variant={'h5'} gutterBottom>
        Nume vechi
      </Typography>
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
    headerName: 'Continutul campului',
    flex: 2,
    editable: true,
    type: 'string',
    renderEditCell: Textarea,
    preProcessEditCellProps: processGridCellValue,
  },
]
