import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FileAPIInput } from 'defs'
import { FileTargetEntitySelector } from './fileTargetEntitySelector'

type Props = {
  entityId?: string
  fileInfo: FileAPIInput | null
  updateFile: (fileInfo: FileAPIInput | null) => void
}

export const ReportContentFile: React.FunctionComponent<Props> = ({
  entityId,
  fileInfo,
  updateFile,
}) => (
  <Box>
    {
      <Box>
        {fileInfo ? (
          <>
            <Typography variant={'h6'}>{fileInfo.name}</Typography>
            <Typography>{fileInfo.description}</Typography>
          </>
        ) : (
          <Typography>Nu ai selectat niciun fisier</Typography>
        )}
      </Box>
    }
    {!!entityId && (
      <FileTargetEntitySelector
        entityId={entityId}
        selectedFile={fileInfo}
        updateFile={updateFile}
      />
    )}
  </Box>
)
