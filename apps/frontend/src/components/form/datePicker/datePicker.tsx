import React from 'react'
import TextField from '@mui/material/TextField'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

type Props = {
  name?: string
  label: string
  error?: string
  value: string | Date | null
  minDate?: Date
  maxDate?: Date
  onChange: (value: Date | null) => Promise<void> | void
  readonly?: boolean
  disableHighlightToday?: boolean
  disableFuture?: boolean
  disablePast?: boolean
  disabled?: boolean
}

export const DatePicker: React.FunctionComponent<Props> = ({
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
}) => (
  <MobileDatePicker
    readOnly={readonly}
    disableFuture={disableFuture}
    disablePast={disablePast}
    disableHighlightToday={!!disableHighlightToday}
    toolbarTitle={label}
    label={label}
    inputFormat={'dd/MM/yyyy'}
    value={value}
    minDate={minDate}
    maxDate={maxDate}
    disabled={disabled}
    onChange={onChange}
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
