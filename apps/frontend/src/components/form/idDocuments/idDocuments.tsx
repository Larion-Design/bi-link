import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DataGrid,
  GridColDef,
  GridPreProcessEditCellProps,
  GridRowModel,
  GridSelectionModel,
  GridToolbarContainer,
} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { IdDocumentAPI, IdDocumentStatus } from 'defs'
import { GridSetItem, useGridSet } from '../../../utils/hooks/useGridSet'
import { AddSuggestionsToolbarButton } from '../../dataGrid/addSuggestionsToolbarButton'
import { RemoveRowsToolbarButton } from '../../dataGrid/removeRowsToolbarButton'

type Props = {
  documents: IdDocumentAPI[]
  suggestions: string[]
  setFieldValue: (documents: IdDocumentAPI[]) => Promise<void>
  readonly?: boolean
  error?: string
}

export const IdDocuments: React.FunctionComponent<Props> = ({
  documents,
  suggestions,
  setFieldValue,
}) => {
  const { values, rawValues, create, update, removeBulk, uid } = useGridSet(documents)
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])

  const processRowUpdate = useCallback(async (newRow: GridRowModel<GridSetItem<IdDocumentAPI>>) => {
    update(newRow)
    return Promise.resolve(newRow)
  }, [])

  const removeSelectedRows = useCallback(() => removeBulk(selectedRows as string[]), [selectedRows])

  useEffect(() => {
    void setFieldValue(rawValues())
  }, [uid])

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: 'documentType' as keyof IdDocumentAPI,
        headerName: 'Tip document',
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
        field: 'documentNumber' as keyof IdDocumentAPI,
        headerName: 'Numar document',
        flex: 1,
        editable: true,
        type: 'string',
        preProcessEditCellProps: (params: GridPreProcessEditCellProps) => {
          const hasError = !params.props.value.length
          return { ...params.props, error: hasError }
        },
      },
      {
        field: 'issueDate' as keyof IdDocumentAPI,
        headerName: 'Data emiterii',
        flex: 1,
        editable: true,
        type: 'date',
      },
      {
        field: 'expirationDate' as keyof IdDocumentAPI,
        headerName: 'Data expirarii',
        flex: 1,
        editable: true,
        type: 'date',
      },
      {
        field: 'status' as keyof IdDocumentAPI,
        headerName: 'Stare',
        flex: 1,
        editable: true,
        type: 'singleSelect',
        valueOptions: [
          {
            value: IdDocumentStatus.VALID,
            label: DocumentStatusSelectOptions.VALID,
          },
          {
            value: IdDocumentStatus.EXPIRED,
            label: DocumentStatusSelectOptions.EXPIRED,
          },
          {
            value: IdDocumentStatus.LOST_OR_STOLEN,
            label: DocumentStatusSelectOptions.LOST_OR_STOLEN,
          },
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
                optionSelected={(documentType) =>
                  create({
                    documentType,
                    documentNumber: '',
                    status: IdDocumentStatus.VALID,
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

export const DocumentStatusSelectOptions: Record<IdDocumentStatus, string> = {
  [IdDocumentStatus.VALID]: 'Valid',
  [IdDocumentStatus.EXPIRED]: 'Expirat',
  [IdDocumentStatus.LOST_OR_STOLEN]: 'Pierdut sau furat',
}
