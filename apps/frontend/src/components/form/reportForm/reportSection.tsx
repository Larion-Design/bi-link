import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDebouncedMap } from '@frontend/utils/hooks/useMap'
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import Grid from '@mui/material/Grid'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Box from '@mui/material/Box'
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import { EntityType, ReportSectionAPIInput } from 'defs'
import { ActionButton } from '../../button/actionButton'
import { useDialog } from '../../dialog/dialogProvider'
import { ToolbarMenu } from '../../menu/toolbarMenu'
import { InputField } from '../inputField'
import { ReportContentElement } from './reportContentElement'

type Props<T = ReportSectionAPIInput> = {
  sectionInfo: T
  updateSectionInfo: (sectionInfo: T) => void
  entityId?: string
  entityType?: EntityType
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
  const { values, uid, add, update, updateBulk, remove, size, keys, entries, map } =
    useDebouncedMap(1000, sectionInfo.content)
  const [draggingElement, setDraggingElement] = useState<string | null>(null)
  const deps = [uid]
  const addTitle = useCallback(
    () => add({ isActive: true, order: size, title: { content: '' } }),
    deps,
  )
  const addText = useCallback(
    () => add({ isActive: true, order: size, text: { content: '' } }),
    deps,
  )
  const addLink = useCallback(
    () => add({ isActive: true, order: size, link: { label: '', url: '' } }),
    deps,
  )
  const addTable = useCallback(() => add({ isActive: true, order: size, table: { id: '' } }), deps)
  const addGraph = useCallback(
    () => add({ isActive: true, order: size, graph: { label: '' } }),
    deps,
  )
  const addImages = useCallback(() => add({ isActive: true, order: size, images: [] }), deps)
  const addFile = useCallback(() => add({ isActive: true, order: size, file: null }), deps)

  useEffect(() => updateSectionInfo({ ...sectionInfo, content: values() }), deps)

  const sortedSections = useMemo(() => {
    const sections = entries()

    if (size > 1) {
      sections.sort(([_, { order: firstSectionOrder }], [__, { order: secondSectionOrder }]) => {
        if (firstSectionOrder < secondSectionOrder) {
          return -1
        }
        if (firstSectionOrder > secondSectionOrder) {
          return 1
        }
        return 0
      })
    }
    return sections
  }, deps)

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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
            label={'Nume capitol'}
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
        <DndContext
          sensors={sensors}
          onDragStart={({ active }) => setDraggingElement(String(active.id))}
          onDragEnd={({ active, over }) => {
            if (over && active && active?.id !== over?.id) {
              const firstItemId = String(active.id)
              const secondItemId = String(over.id)

              updateBulk((map) => {
                if (map.has(firstItemId) && map.has(secondItemId)) {
                  const { order: firstItemOrder, ...firstItemInfo } = map.get(firstItemId)
                  const { order: secondItemOrder, ...secondItemInfo } = map.get(secondItemId)

                  map.set(firstItemId, { ...firstItemInfo, order: secondItemOrder })
                  map.set(secondItemId, { ...secondItemInfo, order: firstItemOrder })
                }
              })
            }
            setDraggingElement(null)
          }}
          onDragCancel={() => setDraggingElement(null)}
        >
          <SortableContext items={keys()} disabled={size < 2}>
            {sortedSections.map(([uid, content]) => (
              <ReportContentElement
                key={uid}
                contentId={uid}
                entityId={entityId}
                entityType={entityType}
                contentInfo={content}
                updateContentInfo={(contentInfo) => update(uid, contentInfo)}
                removeContent={() => removeElement(uid)}
                generateTextPreview={generateTextPreview}
                graphRemoved={graphRemoved}
                graphCreated={graphCreated}
              />
            ))}
          </SortableContext>
          {size > 1 && !!draggingElement && (
            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: {
                    active: {
                      opacity: '0.6',
                    },
                  },
                }),
              }}
            >
              <ReportContentElement
                contentId={draggingElement}
                entityId={entityId}
                entityType={entityType}
                contentInfo={map.get(draggingElement)}
                updateContentInfo={(contentInfo) => update(draggingElement, contentInfo)}
                removeContent={() => removeElement(uid)}
                generateTextPreview={generateTextPreview}
                graphRemoved={graphRemoved}
                graphCreated={graphCreated}
              />
            </DragOverlay>
          )}
        </DndContext>
      </Grid>
    </Box>
  )
}
