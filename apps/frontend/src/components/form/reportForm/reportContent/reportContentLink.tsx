import Box from '@mui/material/Box'
import React from 'react'
import { LinkAPI } from 'defs'
import { InputField } from '../../inputField'

type Props = {
  linkInfo: LinkAPI
  updateLink: (linkInfo: LinkAPI) => void
}

export const ReportContentLink: React.FunctionComponent<Props> = ({
  linkInfo: { label, url },
  updateLink,
}) => (
  <Box sx={{ width: 0.5 }}>
    <InputField label={'Titlu'} value={label} onChange={(label) => updateLink({ url, label })} />
    <InputField label={'URL'} value={url} onChange={(url) => updateLink({ url, label })} />
  </Box>
)
