import React from 'react'
import Box from '@mui/material/Box'
import { FileAPIInput } from 'defs'
import { FilesList } from './filesList'
import { FileUploadBox } from './FileUploadBox'

type Props<T = FileAPIInput> = {
  files: Map<string, T>
  updateFiles: (files: T[]) => void
  updateFile: (file: T) => void
  removeFiles: (uids: string[]) => void
  addFile: (fileInfo: T) => void
  keepDeletedFiles: boolean
}

export const FilesManager: React.FunctionComponent<Props> = ({
  files,
  keepDeletedFiles,
  removeFiles,
  updateFile,
  addFile,
}) => (
  <Box sx={{ width: 1, minHeight: '50vh' }}>
    <FileUploadBox addUploadedFile={addFile}>
      <FilesList
        files={files}
        keepDeletedFiles={keepDeletedFiles}
        updateFile={updateFile}
        removeFiles={removeFiles}
      />
    </FileUploadBox>
  </Box>
)
