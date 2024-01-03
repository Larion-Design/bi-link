import { DatePickerProps } from '@frontend/components/form/datePicker/types'
import React from 'react'
import TextField from '@mui/material/TextField'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { useIntl } from 'react-intl'

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
  views,
}) => {
  const intl = useIntl()
  const fieldLabel = label?.length ? intl.formatMessage({ id: label, defaultMessage: label }) : ''

  return (
    <MobileDatePicker
      views={views}
      readOnly={readonly}
      disableFuture={disableFuture}
      disablePast={disablePast}
      disableHighlightToday={disableHighlightToday}
      showDaysOutsideCurrentMonth={false}
      toolbarTitle={label}
      label={fieldLabel}
      inputFormat={'dd/MM/yyyy'}
      value={value}
      minDate={minDate}
      maxDate={maxDate}
      disabled={disabled}
      onChange={(value) => void onChange(value)}
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
          label={fieldLabel}
          variant={'outlined'}
          error={!!error}
          helperText={error}
        />
      )}
    />
  )
}
