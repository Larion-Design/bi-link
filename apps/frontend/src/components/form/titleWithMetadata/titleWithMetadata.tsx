import { TrustLevelIcon } from '@frontend/components/form/metadata/trustLevelIcon'
import React, { PropsWithChildren, useCallback, useRef, useState } from 'react'
import { Metadata as MetadataType } from 'defs'
import { TypographyVariant } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Metadata } from '../metadata'

type Props<T = MetadataType> = {
  metadata: T
  updateMetadata: (metadata: T) => void
  label: string
  variant: TypographyVariant
}

export const TitleWithMetadata: React.FunctionComponent<PropsWithChildren<Props>> = ({
  label,
  variant,
  metadata,
  updateMetadata,
  children,
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
          updateMetadataInfo={updateMetadata}
          onClose={toggleMetadataView}
        />
      )}
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
        <Stack direction={'row'} alignItems={'center'}>
          <Typography variant={variant}>{label}</Typography>

          <IconButton
            size={'small'}
            ref={(ref) => (metadataElementRef.current = ref)}
            onClick={toggleMetadataView}
          >
            <TrustLevelIcon level={metadata.trustworthiness.level} />
          </IconButton>
        </Stack>

        {children ? (
          <Stack direction={'row'} spacing={2}>
            {children}
          </Stack>
        ) : null}
      </Stack>
    </>
  )
}
