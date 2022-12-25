import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import { FileAPIInput } from 'defs'
import { FilesList } from './filesList'
import { FileUploadBox } from './FileUploadBox'
import { useDebouncedMap } from '../../../utils/hooks/useMap'

type Props = {
  files: FileAPIInput[]
  keepDeletedFiles: boolean
  updateFiles: (files: FileAPIInput[]) => void | Promise<void>
}

export const FilesManager: React.FunctionComponent<Props> = ({
  files,
  keepDeletedFiles,
  updateFiles,
}) => {
  const { update, removeBulk, values, uid, add } = useDebouncedMap(
    1000,
    files,
    ({ fileId }) => fileId,
  )

  useEffect(() => {
    void updateFiles(values())
  }, [uid])

  return (
    <Box
      sx={{
        width: 1,
        minHeight: '50vh',
      }}
    >
      <FileUploadBox addUploadedFile={(fileInfo) => add(fileInfo, ({ fileId }) => fileId)}>
        <FilesList
          files={files}
          keepDeletedFiles={keepDeletedFiles}
          updateFile={update}
          removeFiles={removeBulk}
        />
      </FileUploadBox>
    </Box>
  )
}
