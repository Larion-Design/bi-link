import Stack from '@mui/material/Stack'
import React, { useEffect, useMemo, useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowParams } from '@mui/x-data-grid'
import { GridActionsColDef } from '@mui/x-data-grid/models/colDef/gridColDef'
import { FileAPIInput } from 'defs'
import { getFileInfoRequest } from '../../../graphql/files/getFileInfo'
import { downloadFile } from '../../../utils/download'
import { ModalHeader } from '../modalHeader'

type Props = {
  closeModal: () => void
  files: FileAPIInput[]
  selectFile: (fileInfo: FileAPIInput) => void
  selectedFile: FileAPIInput
}

export const FileSelector: React.FunctionComponent<Props> = ({
  files,
  closeModal,
  selectFile,
  selectedFile,
}) => {
  const [getFileInfo, { data: fileInfo }] = getFileInfoRequest()
  const [fileSelected, setFileSelected] = useState<FileAPIInput | null>(null)

  useEffect(() => {
    if (fileInfo?.getFileInfo?.url.url) {
      downloadFile(fileInfo.getFileInfo.url.url)
    }
  }, [fileInfo?.getFileInfo?.url?.url])

  const columns: Array<GridColDef | GridActionsColDef> = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Nume',
        flex: 1,
        editable: false,
        type: 'string',
      },
      {
        field: 'description',
        headerName: 'Descriere',
        flex: 2,
        editable: false,
        type: 'string',
      },
      {
        field: 'mimeType',
        headerName: 'Tip de fisier',
        editable: false,
        type: 'string',
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
    [getFileInfo],
  )

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      <ModalHeader title={'Fisiere'} closeModal={closeModal} />
      <CardContent sx={{ height: '85%', overflow: 'auto' }}>
        <DataGrid
          columns={columns}
          rows={files}
          getRowId={({ fileId }) => fileId}
          disableColumnFilter
          disableColumnMenu
          disableVirtualization
          hideFooterPagination
          hideFooterSelectedRowCount
          disableColumnSelector
          disableDensitySelector
          onSelectionModelChange={(selectedFiles) =>
            setFileSelected(() =>
              selectedFiles.length
                ? files.find(({ fileId }) => selectedFiles[0] === fileId) ?? null
                : null,
            )
          }
          localeText={{ noRowsLabel: 'Nu au fost gasite fisiere. Incearca alt termen de cautare.' }}
        />
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction={'row'} spacing={2}>
          <Button
            variant={'contained'}
            color={'primary'}
            disabled={!fileSelected}
            onClick={() => selectFile(selectedFile)}
          >
            Selectează
          </Button>

          <Button variant={'outlined'} color={'error'} onClick={closeModal}>
            Inchide
          </Button>
        </Stack>
      </CardActions>
    </Card>
  )
}
