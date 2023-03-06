import React, { useCallback, useMemo, useState } from 'react'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import { LinkAPI } from 'defs'
import { useIntl } from 'react-intl'
import { GeneratePreviewHandler } from '@frontend/utils/hooks/useDataRefProcessor'
import { ActionButton } from '../../../button/actionButton'
import { InputField } from '../../inputField'

type Props = {
  linkInfo: LinkAPI
  updateLink: (linkInfo: LinkAPI) => void
  generateTextPreview: GeneratePreviewHandler
  removeContent: () => void
}

export const ReportContentLink: React.FunctionComponent<Props> = ({
  linkInfo: { label, url },
  updateLink,
  generateTextPreview,
  removeContent,
}) => {
  const intl = useIntl()
  const [preview, setPreview] = useState(false)
  const togglePreview = useCallback(() => setPreview((preview) => !preview), [setPreview])
  const contentPreview = useMemo(() => generateTextPreview(label), [label])

  return (
    <>
      <AccordionDetails>
        <Stack spacing={3}>
          {preview ? (
            <Typography variant={'body2'}>{contentPreview}</Typography>
          ) : (
            <InputField
              label={'Titlu'}
              value={label}
              onChange={(label) => updateLink({ url, label })}
            />
          )}

          <InputField label={'URL'} value={url} onChange={(url) => updateLink({ url, label })} />
        </Stack>
      </AccordionDetails>
      <AccordionActions>
        <ActionButton
          icon={preview ? <EditOutlinedIcon /> : <VisibilityOutlinedIcon />}
          onClick={togglePreview}
          label={intl.formatMessage({ id: preview ? 'edit' : 'preview' })}
          disabled={!contentPreview.length}
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
