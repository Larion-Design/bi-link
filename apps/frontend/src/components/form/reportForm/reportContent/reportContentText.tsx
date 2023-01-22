import Box from '@mui/material/Box'
import React, { useState } from 'react'
import { TextAPI } from 'defs'
import { InputField } from '../../inputField'

type Props = {
  textInfo: TextAPI
  updateText: (textInfo: TextAPI) => void
}

export const ReportContentText: React.FunctionComponent<Props> = ({
  textInfo: { content },
  updateText,
}) => {
  const [preview, setPreview] = useState(false)

  return (
    <Box>
      <InputField
        label={'Paragraf'}
        value={content}
        rows={10}
        multiline
        onChange={(value) => updateText({ content: value })}
      />
    </Box>
  )
}
