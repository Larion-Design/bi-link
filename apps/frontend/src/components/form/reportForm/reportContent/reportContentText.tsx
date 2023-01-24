import React, { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Button from '@mui/material/Button'
import { TextAPI } from 'defs'
import { FormattedMessage } from 'react-intl'
import { GeneratePreviewHandler } from '../../../../utils/hooks/useDataRefProcessor'
import { InputField } from '../../inputField'

type Props = {
  textInfo: TextAPI
  updateText: (textInfo: TextAPI) => void
  generateTextPreview: GeneratePreviewHandler
}

export const ReportContentText: React.FunctionComponent<Props> = ({
  textInfo: { content },
  updateText,
  generateTextPreview,
}) => {
  const [preview, setPreview] = useState(false)
  const togglePreview = useCallback(() => setPreview((preview) => !preview), [setPreview])
  const contentPreview = useMemo(() => generateTextPreview(content), [content])

  return (
    <Box>
      {preview ? (
        contentPreview
      ) : (
        <InputField
          label={'Paragraf'}
          value={content}
          rows={10}
          multiline
          onChange={(value) => updateText({ content: value })}
        />
      )}
      <Box sx={{ width: 1, display: 'flex', justifyContent: 'flex-end' }}>
        {preview ? (
          <Button startIcon={<EditOutlinedIcon />} onClick={togglePreview}>
            <FormattedMessage id={'edit'} />
          </Button>
        ) : (
          <Button
            startIcon={<VisibilityOutlinedIcon />}
            onClick={togglePreview}
            disabled={!content.length}
          >
            <FormattedMessage id={'preview'} />
          </Button>
        )}
      </Box>
    </Box>
  )
}
