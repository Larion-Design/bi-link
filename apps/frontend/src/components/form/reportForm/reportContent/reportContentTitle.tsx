import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import React, { useCallback, useMemo, useState } from 'react'
import { TitleAPI } from 'defs'
import { FormattedMessage } from 'react-intl'
import { GeneratePreviewHandler } from '../../../../utils/hooks/useDataRefProcessor'
import { InputField } from '../../inputField'

type Props = {
  titleInfo: TitleAPI
  updateTitle: (titleInfo: TitleAPI) => void
  generateTextPreview: GeneratePreviewHandler
}

export const ReportContentTitle: React.FunctionComponent<Props> = ({
  titleInfo: { content },
  updateTitle,
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
          label={'Titlu'}
          value={content}
          onChange={(value) => updateTitle({ content: value })}
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
