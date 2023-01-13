import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FileAPIInput } from 'defs'

type Props = {
  fileInfo: FileAPIInput | null
}

export const ReportContentFile: React.FunctionComponent<Props> = ({ fileInfo: { name } }) => (
  <Box sx={{ width: 1 }}>
    <Typography>{name}</Typography>
  </Box>
)
