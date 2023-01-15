import React, { useCallback, useEffect } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Box from '@mui/material/Box'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { EntityType, ReportSectionAPIInput } from 'defs'
import { useMap } from '../../../utils/hooks/useMap'
import { ActionButton } from '../../button/actionButton'
import { useDialog } from '../../dialog/dialogProvider'
import { ToolbarMenu } from '../../menu/toolbarMenu'
import { InputField } from '../inputField'
import { ReportContentElement } from './reportContentElement'

type Props = {
  entityId?: string
  entityType?: EntityType
  sectionInfo: ReportSectionAPIInput
  updateSectionInfo: (sectionInfo: ReportSectionAPIInput) => void
  removeSection: () => void
}

export const ReportSection: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  sectionInfo,
  updateSectionInfo,
  removeSection,
}) => {
  const dialog = useDialog()
  const { values, entries, uid, add, update, keys, remove } = useMap(sectionInfo.content)
  const deps = [uid]
  const addTitle = useCallback(() => add({ order: keys().length, title: { content: '' } }), deps)
  const addText = useCallback(() => add({ order: keys().length, text: { content: '' } }), deps)
  const addLink = useCallback(
    () => add({ order: keys().length, link: { label: '', url: '' } }),
    deps,
  )
  const addTable = useCallback(() => add({ order: keys().length, table: { id: '' } }), deps)
  const addGraph = useCallback(() => add({ order: keys().length, graph: { label: '' } }), deps)
  const addImages = useCallback(() => add({ order: keys().length, images: [] }), deps)
  const addFile = useCallback(() => add({ order: keys().length, file: null }), deps)

  useEffect(() => updateSectionInfo({ ...sectionInfo, content: values() }), deps)

  const openDialogToRemoveSection = useCallback(
    () =>
      dialog.openDialog({
        title: 'Esti sigur ca vrei sa stergi sectiunea?',
        description: 'Tot continutul din sectiune nu mai poate fi recuperat.',
        onConfirm: removeSection,
      }),
    [dialog, uid],
  )

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
            icon={<AddOutlinedIcon />}
            menuOptions={[
              { label: 'Titlu', onClick: addTitle },
              { label: 'Paragraf', onClick: addText },
              { label: 'Link', onClick: addLink },
              { label: 'Images', onClick: addImages },
              { label: 'Fisier', onClick: addFile },
              { label: 'Grafic', onClick: addGraph },
              { label: 'Tabel', onClick: addTable },
            ]}
          />

          <ActionButton
            label={'Sterge sectiunea de raport'}
            icon={<DeleteOutlinedIcon color={'error'} fontSize={'small'} />}
            onClick={openDialogToRemoveSection}
          />
        </Box>
      </Box>
      <Box sx={{ width: 1 }}>
        {entries().map(([uid, content]) => (
          <ReportContentElement
            key={uid}
            entityId={entityId}
            entityType={entityType}
            contentInfo={content}
            updateContentInfo={(contentInfo) => update(uid, contentInfo)}
            removeContent={() => remove(uid)}
          />
        ))}
      </Box>
    </Box>
  )
}
