import Box from '@mui/material/Box'
import React, { useCallback, useEffect, useState } from 'react'
import { CustomFieldAPI } from 'defs'
import { GridSetItem, useGridSet } from '../../../utils/hooks/useGridSet'
import {
  DataGrid,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRowModel,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import { Textarea } from '../../dataGrid/textArea'
import { AddSuggestionsToolbarButton } from '../../dataGrid/addSuggestionsToolbarButton'
import { RemoveRowsToolbarButton } from '../../dataGrid/removeRowsToolbarButton'

type Props = {
  readonly?: boolean
  fields: CustomFieldAPI[]
  setFieldValue: (values: CustomFieldAPI[]) => void | Promise<void>
  error?: string
  suggestions?: string[]
}

export const CustomInputFields: React.FunctionComponent<Props> = ({
  fields,
  setFieldValue,
  suggestions,
}) => {
  const { values, rawValues, create, update, removeBulk, uid } = useGridSet(
    fields,
    ({ _id }) => _id,
  )
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<GridSetItem<CustomFieldAPI>>) => {
      update(newRow)
      return Promise.resolve(newRow)
    },
    [],
  )

  const removeSelectedRows = useCallback(() => removeBulk(selectedRows as string[]), [selectedRows])

  useEffect(() => {
    void setFieldValue(rawValues())
  }, [uid])

  return (
    <Box sx={{ height: 1, width: 1 }}>
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
              <AddSuggestionsToolbarButton
                defaultOption={''}
                options={suggestions}
                optionSelected={(fieldName) =>
                  create({
                    fieldName,
                    fieldValue: '',
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

const columns: GridColDef[] = [
  {
    field: 'fieldName',
    headerName: 'Numele campului',
    editable: true,
    type: 'string',
    flex: 1,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      if (params.hasChanged) {
        const hasError = !params.props.value.length
        return { ...params.props, error: hasError }
      }
      return params
    },
  },
  {
    field: 'fieldValue',
    headerName: 'Continutul campului',
    flex: 2,
    editable: true,
    type: 'string',
    renderEditCell: Textarea,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
      const hasError = !params.props.value.length
      return { ...params.props, error: hasError }
    },
  },
]
