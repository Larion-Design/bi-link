import React, { useCallback, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Box from '@mui/material/Box'
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import { EntityType, ReportSectionAPIInput } from 'defs'
import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd'
import { useDebouncedMap } from '../../../utils/hooks/useMap'
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
  graphCreated: (graphId: string) => void
  graphRemoved: (graphId: string) => void
}

export const ReportSection: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  sectionInfo,
  updateSectionInfo,
  removeSection,
  generateTextPreview,
  graphCreated,
  graphRemoved,
}) => {
  const dialog = useDialog()
  const { values, entries, uid, add, update, updateBulk, keys, remove, map } = useDebouncedMap(
    1000,
    sectionInfo.content,
  )
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

  const onContentReorder: OnDragEndResponder = useCallback(
    ({
      source: { droppableId: sourceUid, index: sourceIndex },
      destination: { droppableId: targetUid, index: targetIndex },
    }) =>
      updateBulk((items) => {
        items.set(sourceUid, { ...items.get(sourceUid), order: targetIndex })
        items.set(targetUid, { ...items.get(targetUid), order: sourceIndex })
      }),
    [uid],
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
      <DragDropContext onDragEnd={onContentReorder}>
        <Droppable droppableId={'reportContentItems'}>
          {(provided, snapshot) => (
            <Grid container spacing={2} ref={provided.innerRef}>
              {entries().map(([uid, content], index) => (
                <Draggable draggableId={uid} index={index}>
                  {(provided, snapshot) => (
                    <Grid
                      item
                      xs={12}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ReportContentElement
                        entityId={entityId}
                        entityType={entityType}
                        contentInfo={content}
                        updateContentInfo={(contentInfo) => update(uid, contentInfo)}
                        removeContent={() => removeElement(uid)}
                        generateTextPreview={generateTextPreview}
                        graphRemoved={graphRemoved}
                        graphCreated={graphCreated}
                      />
                    </Grid>
                  )}
                </Draggable>
              ))}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}
