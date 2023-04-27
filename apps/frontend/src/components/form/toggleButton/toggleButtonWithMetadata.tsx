import { Metadata } from '@frontend/components/form/metadata'
import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'
import { ToggleButton } from '@frontend/components/form/toggleButton/toggleButton'
import { ToggleButtonProps } from '@frontend/components/form/toggleButton/types'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import { BooleanWithMetadata } from 'defs'
import React, { useCallback, useRef, useState } from 'react'

type Props<T = BooleanWithMetadata> = Omit<ToggleButtonProps, 'onChange' | 'checked'> & {
  fieldInfo: T
  updateFieldInfo: (fieldInfo: T) => void
}

export const ToggleButtonWithMetadata: React.FunctionComponent<Props> = ({
  label,
  fieldInfo: { value, metadata },
  updateFieldInfo,
  disabled,
}) => {
  const metadataIconRef = useRef<Element | null>(null)
  const [open, setMetadataViewOpen] = useState(false)

  const toggleMetadataView = useCallback(
    () => setMetadataViewOpen((open) => !open),
    [setMetadataViewOpen],
  )

  return (
    <Stack direction={'row'} spacing={1}>
      <ToggleButton
        label={label}
        checked={value}
        onChange={(value) => updateFieldInfo({ value, metadata })}
      />
      <IconButton ref={(ref) => (metadataIconRef.current = ref)} onClick={toggleMetadataView}>
        <TrustLevelIcon level={metadata.trustworthiness.level} />
      </IconButton>

      {open && !!metadataIconRef.current && (
        <Metadata
          targetElement={metadataIconRef.current}
          metadataInfo={metadata}
          updateMetadataInfo={(metadata) => updateFieldInfo({ value, metadata })}
          onClose={toggleMetadataView}
        />
      )}
    </Stack>
  )
}
