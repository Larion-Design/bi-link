import React from 'react'
import { Trustworthiness } from '@frontend/components/form/metadata/trustworthiness'
import Stack from '@mui/material/Stack'
import Popper from '@mui/material/Popper'
import { Metadata as MetadataType } from 'defs'

type Props = {
  targetElement: Element
  metadataInfo: MetadataType
  updateMetadataInfo: (metadataInfo: MetadataType) => void
}

export const Metadata: React.FunctionComponent<Props> = ({
  metadataInfo,
  updateMetadataInfo,
  targetElement,
}) => (
  <Popper open={true} anchorEl={targetElement} placement={'top'}>
    <Stack spacing={2}>
      <Trustworthiness
        trustworthiness={metadataInfo.trustworthiness}
        updateTrustworthiness={(trustworthiness) =>
          updateMetadataInfo({ ...metadataInfo, trustworthiness })
        }
      />
    </Stack>
  </Popper>
)
