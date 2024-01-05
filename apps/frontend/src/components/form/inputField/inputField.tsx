import React, { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import TextField from '@mui/material/TextField'
import { InputFieldProps } from './types'

export const InputField: React.FunctionComponent<InputFieldProps> = ({
  size,
  name,
  label,
  value,
  error,
  readonly,
  onChange,
  multiline,
  rows,
  disabled,
  required,
  endIcon,
  startIcon,
  placeholder,
  autoComplete,
}) => {
  const [currentValue, setCurrentValue] = useState(value)
  const debouncedValue = useDebounce(currentValue, 500)

  useEffect(() => void onChange(debouncedValue), [debouncedValue])

  useEffect(() => {
    if (value !== debouncedValue) {
      setCurrentValue(value)
    }
  }, [value])

  return (
    <TextField
      autoComplete={autoComplete}
      size={size}
      required={required}
      data-testid={name}
      autoCapitalize={'on'}
      fullWidth
      name={name}
      label={label}
      placeholder={placeholder}
      multiline={multiline}
      minRows={rows}
      value={currentValue}
      error={!!error}
      helperText={error}
      disabled={disabled}
      onChange={({ target: { value } }) => setCurrentValue(value)}
      onBlur={({ target: { value } }) => setCurrentValue(value)}
      InputProps={{
        readOnly: !!readonly,
        startAdornment: startIcon,
        endAdornment: endIcon,
      }}
    />
  )
}
