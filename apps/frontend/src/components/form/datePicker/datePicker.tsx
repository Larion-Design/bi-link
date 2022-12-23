import React from 'react'
import TextField from '@mui/material/TextField'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'

type Props = {
  name?: string
  label: string
  error?: string
  value: string | Date | null
  onChange: (value: string | null) => Promise<void> | void
  readonly?: boolean
  disableHighlightToday?: boolean
  disableFuture?: boolean
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
}) => (
  <MobileDatePicker
    readOnly={!!readonly}
    disableFuture={!!disableFuture}
    disableHighlightToday={!!disableHighlightToday}
    toolbarTitle={label}
    label={label}
    inputFormat={'dd/MM/yyyy'}
    value={value}
    onChange={(newValue) => void onChange(newValue?.toString?.() ?? null)}
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
