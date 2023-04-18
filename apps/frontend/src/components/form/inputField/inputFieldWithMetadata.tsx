import React, { useCallback, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import { TextWithMetadata } from 'defs'
import { InputField } from '@frontend/components/form/inputField'
import { InputFieldProps } from '@frontend/components/form/inputField/types'
import { Metadata } from '@frontend/components/form/metadata'
import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'

type Props<T = TextWithMetadata> = Omit<InputFieldProps, 'value' | 'onChange'> & {
  fieldInfo: T
  updateFieldInfo?: (fieldInfo: T) => void
}

export const InputFieldWithMetadata: React.FunctionComponent<Props> = ({
  fieldInfo: { value, metadata },
  updateFieldInfo,
  name,
  label,
  readonly,
  error,
  required,
  rows,
  disabled,
  multiline,
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
          metadataInfo={metadata}
          updateMetadataInfo={(metadata) => updateFieldInfo({ value, metadata })}
          onClose={toggleMetadataView}
        />
      )}
      <InputField
        name={name}
        value={value}
        label={label}
        multiline={multiline}
        rows={rows}
        onChange={(value) => updateFieldInfo({ metadata, value })}
        required={required}
        readonly={readonly}
        disabled={disabled}
        error={error}
        endIcon={
          <IconButton
            ref={(ref) => (metadataElementRef.current = ref)}
            onClick={toggleMetadataView}
          >
            <TrustLevelIcon level={metadata.trustworthiness.level} />
          </IconButton>
        }
      />
    </>
  )
}
