import React, { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'

type Props = {
  name?: string
  label: string
  onChange: (value: string) => void
  error?: string
  disabled?: boolean
}

export const InputPassword: React.FunctionComponent<Props> = ({
  label,
  onChange,
  error,
  name,
  disabled,
}) => {
  const [value, setValue] = useState<string>('')
  const [showPassword, setPasswordVisibility] = useState(false)
  const togglePasswordVisibility = useCallback(
    () => setPasswordVisibility((open) => !open),
    [setPasswordVisibility],
  )
  const debouncedValue = useDebounce(value, 100)

  useEffect(() => {
    onChange(debouncedValue)
  }, [debouncedValue])

  return (
    <TextField
      fullWidth
      required
      name={name ?? label}
      type={showPassword ? 'text' : 'password'}
      value={value}
      label={label}
      error={!!error}
      helperText={error ?? ''}
      onChange={({ target: { value } }) => setValue(value)}
      disabled={disabled}
      data-testid={name}
      InputProps={{
        endAdornment: (
          <InputAdornment position={'end'}>
            <IconButton size={'small'} onClick={togglePasswordVisibility} edge={'end'}>
              {showPassword ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}
