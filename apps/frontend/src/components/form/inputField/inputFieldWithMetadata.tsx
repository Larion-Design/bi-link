import { InputField } from '@frontend/components/form/inputField'
import { InputFieldProps } from '@frontend/components/form/inputField/types'
import { Metadata } from '@frontend/components/form/metadata'
import Badge from '@mui/material/Badge'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import React, { useRef, useState } from 'react'
import Stack from '@mui/material/Stack'
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined'
import { TextWithMetadata } from 'defs'

type Props = Omit<InputFieldProps, 'value' | 'onChange'> & {
  fieldInfo: TextWithMetadata
  updateFieldInfo: (fieldInfo: TextWithMetadata) => void
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

  return (
    <>
      {isMetadataViewOpen && !!metadataElementRef.current && (
        <Metadata
          targetElement={metadataElementRef.current}
          metadataInfo={metadata}
          updateMetadataInfo={(metadata) => updateFieldInfo({ value, metadata })}
        />
      )}
      <Stack direction={'row'} alignItems={'center'}>
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
        />

        <ClickAwayListener onClickAway={() => setMetadataViewOpen(false)}>
          <Badge>
            <PsychologyAltOutlinedIcon
              ref={(ref) => (metadataElementRef.current = ref)}
              onClick={() => setMetadataViewOpen(true)}
            />
          </Badge>
        </ClickAwayListener>
      </Stack>
    </>
  )
}
