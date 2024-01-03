import React from 'react'
import { MuiColorInput } from 'mui-color-input'
import { ColorPickerProps } from '@frontend/components/form/colorPicker/types'

export const ColorPicker: React.FunctionComponent<ColorPickerProps> = ({
  name,
  label,
  value,
  disabled,
  error,
  onChange,
  startIcon,
  endIcon,
}) => (
  <MuiColorInput
    name={name}
    label={label}
    value={value}
    variant={'outlined'}
    fullWidth
    disabled={disabled}
    error={!!error}
    helperText={error}
    onChange={onChange}
    InputProps={{
      startAdornment: startIcon,
      endAdornment: endIcon,
    }}
  />
)
