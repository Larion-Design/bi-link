import { InputField } from '@frontend/components/form/inputField'
import { InputFieldProps } from '@frontend/components/form/inputField/types'
import { Metadata } from '@frontend/components/form/metadata'
import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'
import IconButton from '@mui/material/IconButton'
import React, { useCallback, useRef, useState } from 'react'
import Stack from '@mui/material/Stack'
import { TextWithMetadata } from 'defs'

type Props = Omit<InputFieldProps, 'value' | 'onChange'> & {
  fieldInfo: TextWithMetadata
  updateFieldInfo: (fieldInfo: TextWithMetadata) => void
}

export const InputFieldWithMetadata: React.FunctionComponent<Props> = ({
  fieldInfo: { value, metadata },
  updateFieldInfo,
  size,
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
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
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
      </Stack>
    </>
  )
}
