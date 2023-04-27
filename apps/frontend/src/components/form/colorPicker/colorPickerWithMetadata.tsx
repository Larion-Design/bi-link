import { ColorPicker } from '@frontend/components/form/colorPicker/colorPicker'
import { ColorPickerProps } from '@frontend/components/form/colorPicker/types'
import { Metadata } from '@frontend/components/form/metadata'
import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'
import IconButton from '@mui/material/IconButton'
import { TextWithMetadata } from 'defs'
import React, { useCallback, useRef, useState } from 'react'

type Props<T = TextWithMetadata> = Omit<ColorPickerProps, 'value' | 'onChange'> & {
  fieldInfo: T
  updateFieldInfo: (fieldInfo: T) => void
}

export const ColorPickerWithMetadata: React.FunctionComponent<Props> = ({
  fieldInfo: { value, metadata },
  updateFieldInfo,
  error,
  disabled,
  name,
  label,
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
      <ColorPicker
        name={name}
        value={value}
        label={label}
        error={error}
        disabled={disabled}
        onChange={(value) => updateFieldInfo({ value, metadata })}
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
