import React, { useCallback, useRef, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import { OptionalDateWithMetadata } from 'defs'
import { DatePicker } from '@frontend/components/form/datePicker/datePicker'
import { DatePickerProps } from '@frontend/components/form/datePicker/types'
import { Metadata } from '@frontend/components/form/metadata'
import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'

type Props = Omit<DatePickerProps, 'value' | 'onChange' | 'onReset'> & {
  fieldInfo: OptionalDateWithMetadata
  updateFieldInfo: (dateInfo: OptionalDateWithMetadata) => void
}

export const DatePickerWithMetadata: React.FunctionComponent<Props> = ({
  name,
  label,
  error,
  fieldInfo: { metadata, value },
  updateFieldInfo,
  readonly,
  disableHighlightToday,
  disableFuture,
  disablePast,
  minDate,
  maxDate,
  disabled,
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
      <DatePicker
        name={name}
        label={label}
        value={value}
        error={error}
        onChange={(value) => updateFieldInfo({ value, metadata })}
        onReset={() => () => updateFieldInfo({ value: null, metadata })}
        readonly={readonly}
        disableFuture={disableFuture}
        disablePast={disablePast}
        disableHighlightToday={disableHighlightToday}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        endIcon={
          <IconButton ref={(ref) => (metadataIconRef.current = ref)} onClick={toggleMetadataView}>
            <TrustLevelIcon level={metadata.trustworthiness.level} />
          </IconButton>
        }
      />
    </>
  )
}
