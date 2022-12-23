import React from 'react'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'

type Props = {
  isActive: boolean
  onStateChange: (state: boolean) => void
  disabled?: boolean
}

export const AssociateSwitchAction: React.FunctionComponent<Props> = ({
  isActive,
  onStateChange,
  disabled,
}) => (
  <Tooltip
    title={
      isActive
        ? 'Entitatea este activa in cadrul companiei.'
        : 'Entitatea nu mai este activa in cadrul companiei.'
    }
  >
    <Switch
      disabled={disabled}
      size={'small'}
      value={isActive}
      onChange={({ target: { checked } }) => onStateChange(checked)}
    />
  </Tooltip>
)
