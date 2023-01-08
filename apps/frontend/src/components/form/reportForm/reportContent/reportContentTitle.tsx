import React from 'react'
import { TitleAPI } from 'defs'
import { InputField } from '../../inputField'

type Props = {
  titleInfo: TitleAPI
  updateTitle: (titleInfo: TitleAPI) => void
}

export const ReportContentTitle: React.FunctionComponent<Props> = ({
  titleInfo: { content },
  updateTitle,
}) => (
  <InputField
    label={'Titlu'}
    value={content}
    onChange={(value) => updateTitle({ content: value })}
  />
)
