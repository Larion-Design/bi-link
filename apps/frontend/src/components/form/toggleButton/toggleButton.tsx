import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import { ToggleButtonProps } from '@frontend/components/form/toggleButton/types'

export const ToggleButton: React.FunctionComponent<ToggleButtonProps> = ({
  label,
  checked,
  onChange,
  disabled,
}) => (
  <Stack spacing={2} direction={'row'} sx={{ width: 1 }}>
    <Switch
      checked={checked}
      disabled={disabled}
      onChange={(event, checked) => onChange(checked)}
    />
    <Typography>{label}</Typography>
  </Stack>
)
