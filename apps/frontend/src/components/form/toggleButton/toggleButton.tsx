import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'

type Props = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export const ToggleButton: React.FunctionComponent<Props> = ({
  label,
  checked,
  onChange,
  disabled,
}) => (
  <Box sx={{ width: 1, display: 'flex', alignItems: 'center' }}>
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={(event, checked) => onChange(checked)}
    />
    <Typography>{label}</Typography>
  </Box>
)
