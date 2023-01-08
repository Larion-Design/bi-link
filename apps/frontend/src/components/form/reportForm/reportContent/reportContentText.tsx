import React from 'react'
import { TextAPI } from 'defs'
import { InputField } from '../../inputField'

type Props = {
  textInfo: TextAPI
  updateText: (textInfo: TextAPI) => void
}

export const ReportContentText: React.FunctionComponent<Props> = ({
  textInfo: { content },
  updateText,
}) => (
  <InputField
    label={'Paragraf'}
    value={content}
    onChange={(value) => updateText({ content: value })}
  />
)
