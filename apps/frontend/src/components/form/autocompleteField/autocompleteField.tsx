import React from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { InputField } from '../inputField'

type Props = {
  label: string
  value: string
  suggestions?: string[]
  onValueChange: (value: string) => void
  readonly?: boolean
  name?: string
  error?: string
}

export const AutocompleteField: React.FunctionComponent<Props> = ({
  name,
  label,
  value,
  suggestions,
  onValueChange,
  readonly,
  error,
}) =>
  suggestions?.length ? (
    <Autocomplete
      freeSolo
      fullWidth
      disablePortal
      value={value}
      readOnly={readonly}
      options={suggestions}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          required
          fullWidth
          value={value}
          InputLabelProps={{ shrink: true }}
          onChange={({ target: { value } }) => onValueChange(value)}
          onBlur={({ target: { value } }) => onValueChange(value)}
          error={!!error}
          helperText={error}
        />
      )}
    />
  ) : (
    <InputField
      name={name}
      label={label}
      value={value}
      onChange={(value) => onValueChange(value)}
      error={error}
      readonly={readonly}
    />
  )
