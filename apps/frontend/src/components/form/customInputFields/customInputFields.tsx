import { createDatagridItems, getDatagridItemInfo, Unique } from '@frontend/utils/datagridHelpers'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Container from '@mui/material/Container'
import { CustomFieldAPI } from 'defs'
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
  customFields: Map<string, CustomFieldAPI>
  updateCustomField: (uid: string, value: CustomFieldAPI) => void
  addCustomField: (fieldName: string) => void
  removeCustomFields: (uids: string[]) => void
  suggestions?: string[]
}

export const CustomInputFields: React.FunctionComponent<Props> = ({
  customFields,
  updateCustomField,
  addCustomField,
  removeCustomFields,
  suggestions,
}) => {
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const datagridItems = useMemo(() => createDatagridItems(customFields), [customFields])

  const processRowUpdate = useCallback(
    async (newRow: GridRowModel<Unique<CustomFieldAPI>>) => {
      const { id, item } = getDatagridItemInfo(newRow)
      updateCustomField(id, item)
      return Promise.resolve(newRow)
    },
    [updateCustomField],
  )

  const removeSelectedRows = useCallback(
    () => removeCustomFields(selectedRows as string[]),
    [selectedRows, removeCustomFields],
  )

  return (
    <Container sx={{ height: 1, width: 1 }}>
      <DataGrid
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        disableIgnoreModificationsIfProcessingProps
        hideFooterPagination
        hideFooterSelectedRowCount
        rows={datagridItems}
        columns={columns}
        getRowId={({ id }) => id}
        experimentalFeatures={{ newEditingApi: true }}
        processRowUpdate={processRowUpdate}
        onSelectionModelChange={(selectedRows) => setSelectedRows(selectedRows)}
        components={{
          Toolbar: () => (
            <GridToolbarContainer sx={{ p: 2 }}>
              <AddSuggestionsToolbarButton
                defaultOption={''}
                options={suggestions}
                optionSelected={addCustomField}
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
    </Container>
  )
}

const columns: GridColDef[] = [
  {
    field: 'fieldName',
    headerName: 'Numele campului',
    editable: true,
    type: 'string',
    flex: 1,
    preProcessEditCellProps: (params: GridPreProcessEditCellProps<string>) => {
      if (params.hasChanged) {
        const hasError = !params.props.value?.length
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
    preProcessEditCellProps: (params: GridPreProcessEditCellProps<string>) => {
      const hasError = !params.props.value?.length
      return { ...params.props, error: hasError }
    },
  },
]
