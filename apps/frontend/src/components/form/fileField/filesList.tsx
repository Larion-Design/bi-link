import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'
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
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { getFileInfoRequest } from '../../../graphql/files/getFileInfo'
import { Textarea } from '../../dataGrid/textArea'
import { RemoveRowsToolbarButton } from '../../dataGrid/removeRowsToolbarButton'
import { FileAPIInput } from 'defs'

type Props<T = FileAPIInput> = {
  files: T[]
  updateFile: (id: string, file: T) => void | Promise<void>
  keepDeletedFiles: boolean
  removeFiles: (ids: string[]) => void
}

export const FilesList: React.FunctionComponent<Props> = ({ files, updateFile, removeFiles }) => {
  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([])
  const [getFileInfo, { data }] = getFileInfoRequest()

  useEffect(() => {
    if (data?.getFileInfo?.url.url) {
      window.open(data.getFileInfo.url.url, '_blank')
    }
  }, [data?.getFileInfo?.url?.url])

  const columns: Array<GridColDef | GridActionsColDef> = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Nume',
        flex: 1,
        editable: true,
        type: 'string',
      },
      {
        field: 'description',
        headerName: 'Descriere',
        flex: 2,
        editable: true,
        type: 'string',
        renderEditCell: Textarea,
        preProcessEditCellProps: (params: GridPreProcessEditCellProps<string>) => {
          if (params.hasChanged) {
            const hasError = !params.props.value?.length
            return { ...params.props, error: hasError }
          }
          return params
        },
      },
      {
        field: 'isHidden',
        headerName: 'Ascuns',
        editable: false,
        type: 'boolean',
        flex: 1,
      },
      {
        field: 'actions',
        headerName: 'Actiuni',
        flex: 1,
        editable: false,
        type: 'actions',
        getActions: ({ row: { fileId } }: GridRowParams<FileAPIInput>) => [
          <GridActionsCellItem
            showInMenu={false}
            icon={<CloudDownloadOutlinedIcon />}
            label={'Descarca'}
            onClick={() => void getFileInfo({ variables: { fileId } })}
          />,
        ],
      },
    ],
    [],
  )

  const processRowUpdate = useCallback(async (newRow: GridRowModel<FileAPIInput>) => {
    await updateFile(newRow.fileId, newRow)
    return Promise.resolve(newRow)
  }, [])

  const removeSelectedRows = useCallback(
    () => removeFiles(selectedRows as string[]),
    [selectedRows],
  )

  const updateSelectedRows = useCallback(
    (selectedRows: GridSelectionModel) => setSelectedRows(selectedRows),
    [setSelectedRows],
  )

  return (
    <DataGrid
      autoHeight
      checkboxSelection
      disableSelectionOnClick
      disableColumnMenu
      disableDensitySelector
      disableColumnFilter
      disableIgnoreModificationsIfProcessingProps
      hideFooterPagination
      hideFooterSelectedRowCount
      hideFooter
      rows={files}
      columns={columns}
      experimentalFeatures={{ newEditingApi: true }}
      getRowId={({ fileId }: GridRowModel<FileAPIInput>) => fileId}
      processRowUpdate={processRowUpdate}
      onSelectionModelChange={updateSelectedRows}
      components={{
        Toolbar: () => (
          <GridToolbarContainer sx={{ p: 2 }}>
            {!!selectedRows.length && (
              <RemoveRowsToolbarButton onRemovalConfirmed={removeSelectedRows} />
            )}
          </GridToolbarContainer>
        ),
      }}
      localeText={{
        noRowsLabel: 'Nu ai incarcat niciun fisier.',
        footerRowSelected: () => '',
      }}
    />
  )
}
