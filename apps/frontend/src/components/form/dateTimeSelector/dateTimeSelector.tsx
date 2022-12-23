import React from 'react'
import TextField from '@mui/material/TextField'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'

type Props = {
  value: Date | null
  onChange: (value: Date | null) => void
  label: string
  disabled?: boolean
  disableFuture?: boolean
  disablePast?: boolean
  error?: string
}

export const DateTimeSelector: React.FunctionComponent<Props> = ({
  value,
  onChange,
  disabled,
  label,
  disableFuture,
  disablePast,
  error,
}) => (
  <MobileDateTimePicker
    label={label}
    value={value}
    onChange={onChange}
    disabled={disabled}
    disableFuture={disableFuture}
    disablePast={disablePast}
    renderInput={(props) => (
      <TextField {...props} error={!!error} helperText={error} fullWidth />
    )}
  />
)
