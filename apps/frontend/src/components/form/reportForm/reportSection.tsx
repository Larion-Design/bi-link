import React, { useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import { ReportSectionAPIInput } from 'defs'
import { useMap } from '../../../utils/hooks/useMap'
import { ToolbarMenu } from '../../menu/toolbarMenu'
import { InputField } from '../inputField'
import { ReportContentElement } from './reportContentElement'

type Props = {
  sectionInfo: ReportSectionAPIInput
  updateSectionInfo: (sectionInfo: ReportSectionAPIInput) => void
}

export const ReportSection: React.FunctionComponent<Props> = ({
  sectionInfo,
  updateSectionInfo,
}) => {
  const { values, entries, uid, add, update, keys } = useMap(sectionInfo.content)
  const deps = [uid]
  const addTitle = useCallback(() => add({ order: keys().length, title: { content: '' } }), deps)
  const addText = useCallback(() => add({ order: keys().length, text: { content: '' } }), deps)
  const addLink = useCallback(
    () => add({ order: keys().length, link: { label: '', url: '' } }),
    deps,
  )

  useEffect(() => updateSectionInfo({ ...sectionInfo, content: values() }), deps)

  return (
    <Box sx={{ width: 1 }}>
      <Box
        sx={{
          width: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: 0.5 }}>
          <InputField
            label={'Nume sectiune'}
            value={sectionInfo.name}
            onChange={(value) => updateSectionInfo({ ...sectionInfo, name: value })}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <ToolbarMenu
            buttonLabel={'Adaugă'}
            menuOptions={[
              { label: 'Titlu', onClick: addTitle },
              { label: 'Paragraf', onClick: addText },
              { label: 'Link', onClick: addLink },
            ]}
          />
        </Box>
      </Box>
      <Box sx={{ width: 1 }}>
        {entries().map(([uid, content]) => (
          <ReportContentElement
            key={uid}
            images={[]}
            contentInfo={content}
            updateContentInfo={(contentInfo) => update(uid, contentInfo)}
          />
        ))}
      </Box>
    </Box>
  )
}
