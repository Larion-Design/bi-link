import React from 'react'
import { MuiColorInput } from 'mui-color-input'

type Props = {
  name: string
  value: string
  label: string
  disabled?: boolean
  onChange: (value: string) => void | Promise<void>
  error?: string
}

export const ColorPicker: React.FunctionComponent<Props> = ({
  name,
  label,
  value,
  disabled,
  error,
  onChange,
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
    onChange={(value) => onChange(value)}
  />
)
