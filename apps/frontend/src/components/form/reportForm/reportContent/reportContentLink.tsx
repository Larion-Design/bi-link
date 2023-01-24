import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useCallback, useMemo, useState } from 'react'
import { LinkAPI } from 'defs'
import { FormattedMessage } from 'react-intl'
import { GeneratePreviewHandler } from '../../../../utils/hooks/useDataRefProcessor'
import { InputField } from '../../inputField'

type Props = {
  linkInfo: LinkAPI
  updateLink: (linkInfo: LinkAPI) => void
  generateTextPreview: GeneratePreviewHandler
}

export const ReportContentLink: React.FunctionComponent<Props> = ({
  linkInfo: { label, url },
  updateLink,
  generateTextPreview,
}) => {
  const [preview, setPreview] = useState(false)
  const togglePreview = useCallback(() => setPreview((preview) => !preview), [setPreview])
  const contentPreview = useMemo(() => generateTextPreview(label), [label])

  return (
    <Box sx={{ width: 1 }}>
      <Box>
        {preview ? (
          contentPreview
        ) : (
          <InputField
            label={'Titlu'}
            value={label}
            onChange={(label) => updateLink({ url, label })}
          />
        )}
        <InputField label={'URL'} value={url} onChange={(url) => updateLink({ url, label })} />
      </Box>

      <Box sx={{ width: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {preview ? (
          <Button startIcon={<EditOutlinedIcon />} onClick={togglePreview}>
            <FormattedMessage id={'edit'} />
          </Button>
        ) : (
          <Button
            startIcon={<VisibilityOutlinedIcon />}
            onClick={togglePreview}
            disabled={!label.length}
          >
            <FormattedMessage id={'preview'} />
          </Button>
        )}
      </Box>
    </Box>
  )
}
