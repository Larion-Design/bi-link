import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import { useDebounce } from 'usehooks-ts'

type Props = {
  name?: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void | Promise<void>
  readonly?: boolean
  multiline?: boolean
  rows?: number
  disabled?: boolean
  required?: boolean
}

export const InputField: React.FunctionComponent<Props> = ({
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
}) => {
  const [currentValue, setCurrentValue] = useState(value)
  const debouncedValue = useDebounce(currentValue, 500)

  useEffect(() => {
    void onChange(debouncedValue)
  }, [debouncedValue])

  return (
    <TextField
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
      }}
    />
  )
}
