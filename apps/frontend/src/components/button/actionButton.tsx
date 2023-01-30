import React, { ReactNode } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  icon: ReactNode
  label?: string
  onClick: () => void
  disabled?: boolean
}

export const ActionButton: React.FunctionComponent<Props> = ({
  icon,
  label,
  onClick,
  disabled,
}) => {
  const button = (
    <span>
      <IconButton onClick={onClick} color={'primary'} disabled={disabled}>
        {icon}
      </IconButton>
    </span>
  )
  return label ? <Tooltip title={label}>{button}</Tooltip> : button
}
