import { DateTimeSelector } from '@frontend/components/form/dateTimeSelector/dateTimeSelector'
import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'
import IconButton from '@mui/material/IconButton'
import React, { useCallback, useRef, useState } from 'react'
import { DateTimeProps } from '@frontend/components/form/dateTimeSelector/types'
import { Metadata } from '@frontend/components/form/metadata'
import { OptionalDateWithMetadata } from 'defs'
import TextField from '@mui/material/TextField'

type Props = Omit<DateTimeProps, 'value' | 'onChange'> & {
  fieldInfo: OptionalDateWithMetadata
  updateFieldInfo: (dateInfo: OptionalDateWithMetadata) => void
}

export const DateTimeSelectorWithMetadata: React.FunctionComponent<Props> = ({
  fieldInfo: { value, metadata },
  updateFieldInfo,
  disabled,
  label,
  disableFuture,
  disablePast,
  error,
}) => {
  const metadataIconRef = useRef<Element | null>(null)
  const [open, setMetadataViewOpen] = useState(false)

  const toggleMetadataView = useCallback(
    () => setMetadataViewOpen((open) => !open),
    [setMetadataViewOpen],
  )

  return (
    <>
      {open && !!metadataIconRef.current && (
        <Metadata
          targetElement={metadataIconRef.current}
          metadataInfo={metadata}
          updateMetadataInfo={(metadata) => updateFieldInfo({ value, metadata })}
          onClose={toggleMetadataView}
        />
      )}

      <DateTimeSelector
        label={label}
        value={value ? new Date(value) : null}
        onChange={(value) => updateFieldInfo({ value: new Date(value), metadata })}
        disabled={disabled}
        error={error}
        disableFuture={disableFuture}
        disablePast={disablePast}
        endIcon={
          <IconButton ref={(ref) => (metadataIconRef.current = ref)} onClick={toggleMetadataView}>
            <TrustLevelIcon level={metadata.trustworthiness.level} />
          </IconButton>
        }
      />
    </>
  )
}
