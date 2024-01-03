import React, { useMemo } from 'react'
import { useIntl } from 'react-intl'
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
}) => {
  const intl = useIntl()
  const fieldLabel = useMemo(() => {
    if (label) {
      return intl.formatMessage({ id: label, defaultMessage: label })
    }
  }, [intl, label])

  return suggestions?.length ? (
    <AutocompleteInputField
      value={value}
      onChange={onChange}
      label={fieldLabel}
      startIcon={startIcon}
      endIcon={endIcon}
      error={error}
      name={name}
      readonly={readonly}
    />
  ) : (
    <InputField
      name={name}
      label={fieldLabel}
      value={value}
      onChange={(value) => onChange(value)}
      error={error}
      readonly={readonly}
      startIcon={startIcon}
      endIcon={endIcon}
    />
  )
}
