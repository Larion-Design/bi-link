import { DocumentStatusSelectOptions } from '@frontend/components/form/person/idDocuments/documentStatus'
import React, { useCallback, useMemo, useState } from 'react'
import { createDatagridItems, getDatagridItemInfo, Unique } from '@frontend/utils/datagridHelpers'
import {
  DataGrid,
  GridColDef,
  GridPreProcessEditCellProps,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { IdDocumentAPI, IdDocumentStatus } from 'defs'
import { usePersonState } from '../../../../state/personState'
import { AddSuggestionsToolbarButton } from '../../../dataGrid/addSuggestionsToolbarButton'
import { RemoveRowsToolbarButton } from '../../../dataGrid/removeRowsToolbarButton'

type Props<T = IdDocumentAPI> = {
  suggestions: string[]
}

export const IdDocuments: React.FunctionComponent<Props> = ({ suggestions }) => {
  const [documents, updateDocument, addDocument, removeDocuments] = usePersonState(
    ({ documents, updateDocument, addDocument, removeDocuments }) => [
      documents,
      updateDocument,
      addDocument,
      removeDocuments,
    ],
  )
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const datagridItems = useMemo(() => createDatagridItems(documents), [documents])

  const processRowUpdate = useCallback(
    async (newRow: Unique<IdDocumentAPI>) => {
      const { id, item } = getDatagridItemInfo(newRow)
      updateDocument(id, item)
      return Promise.resolve(newRow)
    },
    [updateDocument],
  )

  const removeSelectedRows = useCallback(
    () => removeDocuments(selectedRows as string[]),
    [removeDocuments],
  )

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'documentType',
        headerName: 'Tip document',
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
        field: 'documentNumber',
        headerName: 'Numar document',
        flex: 1,
        editable: true,
        type: 'string',
        preProcessEditCellProps: (params: GridPreProcessEditCellProps<string>) => {
          const hasError = !params.props.value?.length
          return { ...params.props, error: hasError }
        },
      },
      {
        field: 'issueDate',
        headerName: 'Data emiterii',
        flex: 1,
        editable: true,
        type: 'date',
      },
      {
        field: 'expirationDate',
        headerName: 'Data expirarii',
        flex: 1,
        editable: true,
        type: 'date',
      },
      {
        field: 'status',
        headerName: 'Stare',
        flex: 1,
        editable: true,
        type: 'singleSelect',
        valueOptions: [
          { value: 'VALID', label: DocumentStatusSelectOptions.VALID },
          { value: 'EXPIRED', label: DocumentStatusSelectOptions.EXPIRED },
          { value: 'LOST_OR_STOLEN', label: DocumentStatusSelectOptions.LOST_OR_STOLEN },
        ],
      },
    ],
    [],
  )

  return (
    <Box sx={{ minHeight: '50vh', maxHeight: '100vh', width: 1 }}>
      <DataGrid
        autoHeight
        checkboxSelection
        disableSelectionOnClick
        disableIgnoreModificationsIfProcessingProps
        hideFooterPagination
        hideFooterSelectedRowCount
        hideFooter
        rows={datagridItems}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true }}
        getRowId={({ _id }) => String(_id)}
        processRowUpdate={processRowUpdate}
        onSelectionModelChange={(selectedRows) => setSelectedRows(selectedRows)}
        components={{
          Toolbar: () => (
            <GridToolbarContainer sx={{ p: 2 }}>
              <AddSuggestionsToolbarButton
                defaultOption={''}
                options={suggestions}
                optionSelected={addDocument}
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
