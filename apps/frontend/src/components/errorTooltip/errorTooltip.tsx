import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

type Props = {
  message: string
}

export const ErrorTooltip: React.FunctionComponent<Props> = ({ message }) => (
  <Tooltip title={message}>
    <IconButton>
      <ErrorIcon color={'error'} fontSize={'small'} />
    </IconButton>
  </Tooltip>
)
