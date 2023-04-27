import { NumberInputProps } from '@frontend/components/form/inputNumberField/types'
import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField'
import { useDebounce } from 'usehooks-ts'

export const InputNumberField: React.FunctionComponent<NumberInputProps> = ({
  readonly,
  value,
  disabled,
  name,
  label,
  error,
  onChange,
  required,
  inputProps,
}) => {
  const [currentValue, setCurrentValue] = useState(value)
  const debouncedValue = useDebounce(currentValue, 500)

  useEffect(() => {
    void onChange(debouncedValue)
  }, [debouncedValue])

  return (
    <TextField
      type={'number'}
      required={required}
      data-cy={name ?? label}
      fullWidth
      name={name}
      label={label}
      value={currentValue}
      error={!!error}
      helperText={error}
      disabled={disabled}
      onChange={({ target: { value } }) => setCurrentValue(+value)}
      onBlur={({ target: { value } }) => setCurrentValue(+value)}
      InputProps={{
        readOnly: !!readonly,
      }}
      inputProps={inputProps}
    />
  )
}
