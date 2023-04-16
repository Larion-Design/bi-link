import React from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Popper from '@mui/material/Popper'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import { Metadata as MetadataType } from 'defs'
import { Trustworthiness } from '@frontend/components/form/metadata/trustworthiness'

type Props = {
  targetElement: Element
  metadataInfo: MetadataType
  updateMetadataInfo: (metadataInfo: MetadataType) => void
  onClose: () => void
}

export const Metadata: React.FunctionComponent<Props> = ({
  metadataInfo,
  updateMetadataInfo,
  targetElement,
  onClose,
}) => (
  <Popper open={true} anchorEl={targetElement} placement={'top'} sx={{ zIndex: 1000, width: 400 }}>
    <Paper sx={{ pt: 4, pb: 4, pl: 3, pr: 3, backgroundColor: 'background.paper' }}>
      <Stack spacing={1} direction={'row-reverse'}>
        <CloseOutlinedIcon
          color={'error'}
          fontSize={'small'}
          onClick={onClose}
          sx={{ cursor: 'pointer' }}
        />
      </Stack>
      <Stack spacing={2}>
        <Trustworthiness
          trustworthiness={metadataInfo.trustworthiness}
          updateTrustworthiness={(trustworthiness) =>
            updateMetadataInfo({ ...metadataInfo, trustworthiness })
          }
        />
      </Stack>
    </Paper>
  </Popper>
)
