import React from 'react'
import TextField from '@mui/material/TextField'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import { DateTimeProps } from '@frontend/components/form/dateTimeSelector/types'

export const DateTimeSelector: React.FunctionComponent<DateTimeProps> = ({
  value,
  onChange,
  disabled,
  label,
  disableFuture,
  disablePast,
  error,
  startIcon,
  endIcon,
}) => (
  <MobileDateTimePicker
    label={label}
    value={value}
    onChange={onChange}
    disabled={disabled}
    disableFuture={disableFuture}
    disablePast={disablePast}
    renderInput={(props) => <TextField {...props} error={!!error} helperText={error} fullWidth />}
    InputProps={{
      startAdornment: startIcon,
      endAdornment: endIcon,
    }}
  />
)
