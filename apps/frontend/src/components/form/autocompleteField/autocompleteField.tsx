import React from 'react'
import { AutocompleteInputField } from '@frontend/components/form/autocompleteField/autocompleteInputField'
import { AutocompleteFieldProps } from '@frontend/components/form/autocompleteField/types'
import { InputField } from '@frontend/components/form/inputField'

export const AutocompleteField: React.FunctionComponent<AutocompleteFieldProps> = ({
  name,
  label,
  value,
  suggestions,
  onChange,
  readonly,
  error,
  startIcon,
  endIcon,
}) =>
  suggestions?.length ? (
    <AutocompleteInputField
      value={value}
      onChange={onChange}
      label={label}
      startIcon={startIcon}
      endIcon={endIcon}
      error={error}
      name={name}
      readonly={readonly}
    />
  ) : (
    <InputField
      name={name}
      label={label}
      value={value}
      onChange={(value) => onChange(value)}
      error={error}
      readonly={readonly}
      startIcon={startIcon}
      endIcon={endIcon}
    />
  )
