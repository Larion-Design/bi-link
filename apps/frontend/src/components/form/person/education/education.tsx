import { createDatagridItems, getDatagridItemInfo, Unique } from '@frontend/utils/datagridHelpers'
import Box from '@mui/material/Box'
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import React, { useCallback, useMemo, useState } from 'react'
import { EducationAPIInput } from 'defs'
import { processGridCellValue } from '@frontend/utils/dataGrid'
import { usePersonState } from '../../../../state/personState'
import { AddItemToolbarButton } from '../../../dataGrid/addItemToolbarButton'
import { RemoveRowsToolbarButton } from '../../../dataGrid/removeRowsToolbarButton'
import { Textarea } from '../../../dataGrid/textArea'

export const Education: React.FunctionComponent = () => {
  const [education, updateEducation, removeEducation, addEducation] = usePersonState(
    ({ education, updateEducation, removeEducation, addEducation }) => [
      education,
      updateEducation,
      removeEducation,
      addEducation,
    ],
  )
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const removeSelectedRows = useCallback(
    () => removeEducation(selectedRows as string[]),
    [removeEducation, selectedRows],
  )
  const datagridItems = useMemo(() => createDatagridItems(education), [education])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<Unique<EducationAPIInput>>) => {
      const { id, item } = getDatagridItemInfo(newRow)
      updateEducation(id, item)
      return Promise.resolve(newRow)
    },
    [updateEducation],
  )

  return (
    <Box sx={{ minHeight: '50vh', maxHeight: '100vh', width: 1 }}>
      <DataGrid
        autoHeight
        checkboxSelection
        disableDensitySelector
        disableColumnMenu
        disableSelectionOnClick
        disableVirtualization
        disableColumnFilter
        disableColumnSelector
        disableIgnoreModificationsIfProcessingProps
        hideFooterPagination
        hideFooterSelectedRowCount
        hideFooter
        rows={datagridItems}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={processRowUpdate}
        onSelectionModelChange={(selectedRows) => setSelectedRows(selectedRows)}
        components={{
          Toolbar: () => (
            <GridToolbarContainer sx={{ p: 2 }}>
              <AddItemToolbarButton onClick={addEducation} />

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
    field: 'type',
    headerName: 'Tip de studii',
    editable: true,
    type: 'string',
    flex: 1,
    preProcessEditCellProps: processGridCellValue,
  },
  {
    field: 'school',
    headerName: 'Institutie',
    editable: true,
    type: 'string',
    flex: 1.3,
    renderEditCell: Textarea,
    preProcessEditCellProps: processGridCellValue,
  },
  {
    field: 'specialization',
    headerName: 'Specializare',
    flex: 1.3,
    editable: true,
    type: 'string',
    renderEditCell: Textarea,
    preProcessEditCellProps: processGridCellValue,
  },
  {
    field: 'startDate',
    headerName: 'Data inceperii',
    flex: 1,
    editable: true,
    type: 'date',
  },
  {
    field: 'endDate',
    headerName: 'Data finalizarii',
    flex: 1,
    editable: true,
    type: 'date',
  },
]
