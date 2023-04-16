import { BaseTextFieldProps } from '@mui/material'
import React from 'react'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

type Props = {
  label?: string
  disabled?: boolean
  value: string
  options: Record<string | number, string | number | null>
  onChange: (option: string) => void
  size?: BaseTextFieldProps['size']
}

export const DropdownList: React.FunctionComponent<Props> = ({
  label,
  value,
  options,
  onChange,
  disabled,
  size,
}) => (
  <TextField
    size={size}
    select
    fullWidth
    required
    value={value}
    disabled={!!disabled}
    label={label}
    onChange={({ target: { value } }) => onChange(value)}
  >
    {Object.entries(options).map(([option, label]) => (
      <MenuItem key={option} value={option}>
        {label ?? option}
      </MenuItem>
    ))}
  </TextField>
)
