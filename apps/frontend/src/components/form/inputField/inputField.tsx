import React, { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import TextField from '@mui/material/TextField'
import { InputFieldProps } from '@frontend/components/form/inputField/types'

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
}) => {
  const [currentValue, setCurrentValue] = useState(value)
  const debouncedValue = useDebounce(currentValue, 500)

  useEffect(() => {
    void onChange(debouncedValue)
  }, [debouncedValue])

  useEffect(() => {
    if (value !== debouncedValue) {
      setCurrentValue(value)
    }
  }, [value])

  return (
    <TextField
      size={size}
      required={required}
      data-cy={name}
      autoCapitalize={'on'}
      fullWidth
      name={name}
      label={label}
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
