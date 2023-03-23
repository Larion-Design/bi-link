import Box from '@mui/material/Box'
import React, { useCallback, useMemo, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { TitleAPI } from 'defs'
import { useIntl } from 'react-intl'
import { GeneratePreviewHandler } from '@frontend/utils/hooks/useDataRefProcessor'
import { ActionButton } from '../../../button/actionButton'
import { InputField } from '../../inputField'

type Props = {
  titleInfo: TitleAPI
  updateTitle: (titleInfo: TitleAPI) => void
  generateTextPreview: GeneratePreviewHandler
  removeContent: () => void
}

export const ReportContentTitle: React.FunctionComponent<Props> = ({
  titleInfo: { content },
  updateTitle,
  generateTextPreview,
  removeContent,
}) => {
  const { formatMessage } = useIntl()
  const [preview, setPreview] = useState(false)
  const togglePreview = useCallback(() => setPreview((preview) => !preview), [setPreview])
  const contentPreview = useMemo(() => generateTextPreview(content), [content])

  return (
    <>
      <AccordionDetails>
        <Box sx={{ width: 1 }}>
          {preview ? (
            contentPreview
          ) : (
            <InputField
              label={'Titlu'}
              value={content}
              onChange={(value) => updateTitle({ content: value })}
            />
          )}
        </Box>
      </AccordionDetails>
      <AccordionActions>
        <ActionButton
          icon={preview ? <EditOutlinedIcon /> : <VisibilityOutlinedIcon />}
          onClick={togglePreview}
          label={formatMessage({ id: preview ? 'edit' : 'preview' })}
          disabled={!content.length}
        />
        <ActionButton
          icon={<DeleteOutlinedIcon color={'error'} />}
          onClick={removeContent}
          label={'Sterge element'}
        />
      </AccordionActions>
    </>
  )
}
