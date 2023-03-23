import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'

type Props = {
  value: number
  disabled?: boolean
  name?: string
  label: string
  error?: string
  required?: boolean
  readonly?: boolean
  onChange: (value: number) => void | Promise<void>
}

export const InputNumberField: React.FunctionComponent<Props> = ({
  readonly,
  value,
  disabled,
  name,
  label,
  error,
  onChange,
  required,
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
      data-cy={name}
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
    />
  )
}
