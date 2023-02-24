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
import { EducationAPIInput, OldNameAPIInput } from 'defs'
import { processGridCellValue } from '../../../utils/dataGrid'
import { GridSetItem, useGridSet } from '../../../utils/hooks/useGridSet'
import { AddItemToolbarButton } from '../../dataGrid/addItemToolbarButton'
import { RemoveRowsToolbarButton } from '../../dataGrid/removeRowsToolbarButton'
import { Textarea } from '../../dataGrid/textArea'

type Props = {
  education: EducationAPIInput[]
  updateEducation: (education: EducationAPIInput[]) => void | Promise<void>
}

export const Education: React.FunctionComponent<Props> = ({ education, updateEducation }) => {
  const { uid, values, rawValues, create, update, removeBulk } = useGridSet(education)
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const removeSelectedRows = useCallback(
    () => removeBulk(selectedRows as string[]),
    [uid, selectedRows],
  )
  const addEducation = useCallback(
    () =>
      create({
        customFields: [],
        endDate: null,
        specialization: '',
        startDate: null,
        type: '',
        school: '',
      }),
    [uid],
  )

  useEffect(() => {
    void updateEducation(rawValues())
  }, [uid])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<GridSetItem<EducationAPIInput>>) => {
      update(newRow)
      return Promise.resolve(newRow)
    },
    [],
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
