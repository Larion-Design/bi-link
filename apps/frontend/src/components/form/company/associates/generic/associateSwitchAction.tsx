import React, { useCallback, useRef, useState } from 'react'
import { BooleanWithMetadata } from 'defs'
import { Metadata } from '@frontend/components/form/metadata'
import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'

type Props<T = BooleanWithMetadata> = {
  isActive: T
  onStateChange: (isActive: T) => void
  disabled?: boolean
}

export const AssociateSwitchAction: React.FunctionComponent<Props> = ({
  isActive: { value, metadata },
  onStateChange,
  disabled,
}) => {
  const metadataIconRef = useRef<Element | null>(null)
  const [open, setMetadataViewOpen] = useState(false)

  const toggleMetadataView = useCallback(
    () => setMetadataViewOpen((open) => !open),
    [setMetadataViewOpen],
  )

  return (
    <Stack direction={'row'} spacing={2}>
      <Tooltip
        title={
          value
            ? 'Entitatea este activa in cadrul companiei.'
            : 'Entitatea nu mai este activa in cadrul companiei.'
        }
      >
        <Switch
          disabled={disabled}
          size={'small'}
          value={value}
          onChange={({ target: { checked } }) => onStateChange({ metadata, value: checked })}
        />
      </Tooltip>

      <IconButton ref={(ref) => (metadataIconRef.current = ref)} onClick={toggleMetadataView}>
        <TrustLevelIcon level={metadata.trustworthiness.level} />
      </IconButton>

      {open && !!metadataIconRef.current && (
        <Metadata
          targetElement={metadataIconRef.current}
          metadataInfo={metadata}
          updateMetadataInfo={(metadata) => onStateChange({ value, metadata })}
          onClose={toggleMetadataView}
        />
      )}
    </Stack>
  )
}
