import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import React, { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { TextAPI } from 'defs'
import { useIntl } from 'react-intl'
import { GeneratePreviewHandler } from '@frontend/utils/hooks/useDataRefProcessor'
import { useReportState } from '../../../../state/report/reportState'
import { ActionButton } from '../../../button/actionButton'
import { InputField } from '../../inputField'

type Props = {
  textInfo: TextAPI
  updateText: (textInfo: TextAPI) => void
  removeContent: () => void
}

export const ReportContentText: React.FunctionComponent<Props> = ({
  textInfo: { content },
  updateText,
  removeContent,
}) => {
  const intl = useIntl()
  const { computeRefsValues } = useReportState()
  const [preview, setPreview] = useState(false)
  const togglePreview = useCallback(() => setPreview((preview) => !preview), [setPreview])
  const contentPreview = useMemo(() => computeRefsValues(content), [content, computeRefsValues])

  return (
    <>
      <AccordionDetails>
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
        </Box>
      </AccordionDetails>
      <AccordionActions>
        <ActionButton
          icon={preview ? <EditOutlinedIcon /> : <VisibilityOutlinedIcon />}
          onClick={togglePreview}
          label={intl.formatMessage({ id: preview ? 'edit' : 'preview' })}
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
