import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'
import IconButton from '@mui/material/IconButton'
import React, { useCallback, useRef, useState } from 'react'
import { InputNumberField } from '@frontend/components/form/inputNumberField/inputNumberField'
import { Metadata } from '@frontend/components/form/metadata'
import { NumberWithMetadata } from 'defs'
import { NumberInputProps } from '@frontend/components/form/inputNumberField/types'

type Props<T = NumberWithMetadata> = Omit<NumberInputProps, 'value' | 'onChange'> & {
  fieldInfo: T
  updateFieldInfo?: (fieldInfo: T) => void
}

export const InputNumberFieldWithMetadata: React.FunctionComponent<Props> = ({
  fieldInfo: { value, metadata },
  updateFieldInfo,
  disabled,
  name,
  label,
  error,
  required,
  inputProps,
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
      <InputNumberField
        name={name}
        disabled={disabled}
        error={error}
        required={required}
        value={value}
        label={label}
        onChange={(value) => updateFieldInfo({ metadata, value })}
        inputProps={inputProps}
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
