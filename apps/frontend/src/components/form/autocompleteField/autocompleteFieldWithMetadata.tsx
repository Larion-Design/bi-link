import React, { useCallback, useRef, useState } from 'react'
import { NumberWithMetadata, TextWithMetadata } from 'defs'
import IconButton from '@mui/material/IconButton'
import { AutocompleteInputField } from '@frontend/components/form/autocompleteField/autocompleteInputField'
import { AutocompleteFieldProps } from '@frontend/components/form/autocompleteField/types'
import { InputFieldWithMetadata } from '@frontend/components/form/inputField'
import { Metadata } from '@frontend/components/form/metadata'
import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'

type Props<T = TextWithMetadata> = Omit<AutocompleteFieldProps, 'value' | 'onChange'> & {
  fieldInfo: T
  updateFieldInfo: (fieldInfo: T) => void
}

export const AutocompleteFieldWithMetadata: React.FunctionComponent<Props> = ({
  name,
  label,
  fieldInfo,
  suggestions,
  updateFieldInfo,
  readonly,
  error,
}) => {
  const metadataElementRef = useRef<Element | null>(null)
  const [isMetadataViewOpen, setMetadataViewOpen] = useState(false)
  const toggleMetadataView = useCallback(
    () => setMetadataViewOpen((open) => !open),
    [setMetadataViewOpen],
  )

  return (
    <>
      {isMetadataViewOpen && !!metadataElementRef.current && (
        <Metadata
          targetElement={metadataElementRef.current}
          metadataInfo={fieldInfo.metadata}
          updateMetadataInfo={(metadata) => updateFieldInfo({ ...fieldInfo, metadata })}
          onClose={toggleMetadataView}
        />
      )}

      {suggestions.length ? (
        <AutocompleteInputField
          name={name}
          label={label}
          value={fieldInfo.value}
          onChange={(value) => updateFieldInfo({ ...fieldInfo, value })}
          readonly={readonly}
          error={error}
          endIcon={
            <IconButton
              ref={(ref) => (metadataElementRef.current = ref)}
              onClick={toggleMetadataView}
            >
              <TrustLevelIcon level={fieldInfo.metadata.trustworthiness.level} />
            </IconButton>
          }
        />
      ) : (
        <InputFieldWithMetadata
          name={name}
          label={label}
          readonly={readonly}
          error={error}
          fieldInfo={fieldInfo}
          updateFieldInfo={updateFieldInfo}
        />
      )}
    </>
  )
}
