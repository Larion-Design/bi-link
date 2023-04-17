import { DatePickerProps } from '@frontend/components/form/datePicker/types'
import React from 'react'
import TextField from '@mui/material/TextField'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

export const DatePicker: React.FunctionComponent<DatePickerProps> = ({
  name,
  label,
  error,
  value,
  onChange,
  readonly,
  disableHighlightToday,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  disabled,
  startIcon,
  endIcon,
}) => (
  <MobileDatePicker
    readOnly={readonly}
    disableFuture={disableFuture}
    disablePast={disablePast}
    disableHighlightToday={disableHighlightToday}
    showDaysOutsideCurrentMonth={false}
    toolbarTitle={label}
    label={label}
    inputFormat={'dd/MM/yyyy'}
    value={value}
    minDate={minDate}
    maxDate={maxDate}
    disabled={disabled}
    onChange={onChange}
    InputProps={{
      startAdornment: startIcon,
      endAdornment: endIcon,
    }}
    renderInput={(params) => (
      <TextField
        {...params}
        fullWidth
        onReset={() => void onChange(null)}
        name={name}
        label={label}
        variant={'outlined'}
        error={!!error}
        helperText={error}
      />
    )}
  />
)
