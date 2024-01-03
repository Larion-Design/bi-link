import React, { useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { AutocompleteFieldProps } from '@frontend/components/form/autocompleteField/types'

export const AutocompleteInputField: React.FunctionComponent<AutocompleteFieldProps> = ({
  name,
  label,
  value,
  suggestions,
  onChange,
  readonly,
  error,
  startIcon,
  endIcon,
}) => {
  const [fieldValue, setFieldValue] = useState(value)
  const debouncedFieldValue = useDebounce(fieldValue, 1000)

  useEffect(() => {
    onChange(debouncedFieldValue)
  }, [debouncedFieldValue])

  return (
    <Autocomplete
      freeSolo
      fullWidth
      disablePortal
      value={fieldValue}
      readOnly={readonly}
      options={suggestions}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          required
          fullWidth
          value={fieldValue}
          InputLabelProps={{ shrink: true }}
          onChange={({ target: { value } }) => setFieldValue(value)}
          onBlur={({ target: { value } }) => setFieldValue(value)}
          error={!!error}
          helperText={error}
          InputProps={{
            startAdornment: startIcon,
            endAdornment: endIcon,
            readOnly: readonly,
          }}
        />
      )}
    />
  )
}
