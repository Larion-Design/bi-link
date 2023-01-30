import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Box from '@mui/material/Box'
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
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
  generateTextPreview: (text: string) => string
}

export const ReportSection: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  sectionInfo,
  updateSectionInfo,
  removeSection,
  generateTextPreview,
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

  const removeElement = useCallback(
    (elementId: string) =>
      dialog.openDialog({
        title: 'Esti sigur ca vrei sa stergi acest element?',
        description: 'Odata sters, elementul nu mai poate fi recuperat',
        onConfirm: () => remove(elementId),
      }),
    [dialog, uid],
  )

  const openDialogToRemoveSection = useCallback(
    () =>
      dialog.openDialog({
        title: 'Esti sigur ca vrei sa stergi acest capitol?',
        description: 'Tot continutul din capitol nu mai poate fi recuperat.',
        onConfirm: removeSection,
      }),
    [dialog, uid],
  )

  return (
    <Box>
      <Box
        sx={{
          width: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
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
            label={'Adauga element'}
            icon={<AddCardOutlinedIcon color={'primary'} />}
            menuOptions={[
              { label: 'Fisier', onClick: addFile },
              { label: 'Grafic relational', onClick: addGraph },
              { label: 'Imagini', onClick: addImages },
              { label: 'Link', onClick: addLink },
              { label: 'Tabel', onClick: addTable },
              { label: 'Text', onClick: addText },
              { label: 'Titlu', onClick: addTitle },
            ]}
          />

          <ActionButton
            label={`Sterge capitolul "${sectionInfo.name}"`}
            icon={<DeleteOutlinedIcon color={'error'} fontSize={'small'} />}
            onClick={openDialogToRemoveSection}
          />
        </Box>
      </Box>
      <Grid container spacing={2}>
        {entries().map(([uid, content]) => (
          <Grid key={uid} item xs={12}>
            <ReportContentElement
              entityId={entityId}
              entityType={entityType}
              contentInfo={content}
              updateContentInfo={(contentInfo) => update(uid, contentInfo)}
              removeContent={() => removeElement(uid)}
              generateTextPreview={generateTextPreview}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
