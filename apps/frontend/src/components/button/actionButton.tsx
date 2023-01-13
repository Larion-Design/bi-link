import React, { ReactNode } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  icon: ReactNode
  label?: string
  onClick: () => void
}

export const ActionButton: React.FunctionComponent<Props> = ({ icon, label, onClick }) => {
  const button = <IconButton onClick={onClick}>{icon}</IconButton>
  return label ? <Tooltip title={label}>{button}</Tooltip> : button
}
