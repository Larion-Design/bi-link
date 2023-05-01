import React, { useCallback, useMemo, useState } from 'react'
import {
  DragOverlay,
  defaultDropAnimationSideEffects,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import Grid from '@mui/material/Grid'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Box from '@mui/material/Box'
import AddCardOutlinedIcon from '@mui/icons-material/AddCardOutlined'
import { EntityType } from 'defs'
import { useReportState } from '../../../state/report/reportState'
import { ActionButton } from '../../button/actionButton'
import { useDialog } from '../../dialog/dialogProvider'
import { ToolbarMenu } from '../../menu/toolbarMenu'
import { InputField } from '../inputField'
import { ReportContentElement } from './reportContentElement'

type Props = {
  entityId?: string
  entityType?: EntityType
  sectionId: string
}

export const ReportSection: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  sectionId,
}) => {
  const dialog = useDialog()
  const [sections, updateSectionName, updateContent, addContent, reportContent, removeSection] =
    useReportState(
      ({
        sections,
        updateSectionName,
        updateContent,
        addContent,
        reportContent,
        removeSection,
      }) => [sections, updateSectionName, updateContent, addContent, reportContent, removeSection],
    )
  const [draggingElement, setDraggingElement] = useState<string | null>(null)
  const sectionInfo = sections.get(sectionId)

  const addContentElement = useCallback(
    (type: 'TEXT' | 'TITLE' | 'GRAPH' | 'LINK' | 'TABLE' | 'IMAGES' | 'FILE') => {
      const order = sectionInfo.content.size
      const isActive = true

      switch (type) {
        case 'TEXT':
          return addContent(sectionId, { isActive, order, text: { content: '' } })
        case 'TITLE':
          return addContent(sectionId, { isActive, order, title: { content: '' } })
        case 'LINK':
          return addContent(sectionId, { isActive, order, link: { label: '', url: '' } })
        case 'TABLE':
          return addContent(sectionId, { isActive, order, table: { id: '' } })
        case 'GRAPH':
          return addContent(sectionId, { isActive, order, graph: { label: '' } })
        case 'FILE':
          return addContent(sectionId, { isActive, order, file: null })
        case 'IMAGES':
          return addContent(sectionId, { isActive, order, images: [] })
      }
    },
    [sectionId, addContent, sectionInfo.content],
  )

  const sortedSections = useMemo(() => {
    const contentEntries = Array.from(reportContent.entries())

    if (!draggingElement) {
      return contentEntries.sort(
        ([_, { order: firstSectionOrder }], [__, { order: secondSectionOrder }]) => {
          if (firstSectionOrder < secondSectionOrder) {
            return -1
          }
          if (firstSectionOrder > secondSectionOrder) {
            return 1
          }
          return 0
        },
      )
    }
    return contentEntries
  }, [reportContent, draggingElement])

  const openDialogToRemoveSection = useCallback(
    () =>
      dialog.openDialog({
        title: 'Esti sigur ca vrei sa stergi acest capitol?',
        description: 'Tot continutul din capitol nu mai poate fi recuperat.',
        onConfirm: () => removeSection(sectionId),
      }),
    [dialog, removeSection],
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
            onChange={(value) => updateSectionName(sectionId, value)}
          />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <ToolbarMenu
            label={'Adauga element'}
            icon={<AddCardOutlinedIcon color={'primary'} />}
            menuOptions={[
              { label: 'Fisier', onClick: () => addContentElement('TEXT') },
              { label: 'Grafic relational', onClick: () => addContentElement('GRAPH') },
              { label: 'Imagini', onClick: () => addContentElement('IMAGES') },
              { label: 'Link', onClick: () => addContentElement('LINK') },
              { label: 'Tabel', onClick: () => addContentElement('TABLE') },
              { label: 'Text', onClick: () => addContentElement('TEXT') },
              { label: 'Titlu', onClick: () => addContentElement('TITLE') },
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
            if (over?.id && active?.id && active?.id !== over?.id) {
              const itemIdA = String(active.id)
              const itemIdB = String(over.id)

              if (reportContent.has(itemIdA) && reportContent.has(itemIdB)) {
                const { order: itemOrderA, ...itemInfoA } = reportContent.get(itemIdA)
                const { order: itemOrderB, ...itemInfoB } = reportContent.get(itemIdB)

                updateContent(itemIdA, { ...itemInfoA, order: itemOrderB })
                updateContent(itemIdB, { ...itemInfoB, order: itemOrderA })
              }
            }
            setDraggingElement(null)
          }}
          onDragCancel={() => setDraggingElement(null)}
        >
          <SortableContext
            items={Array.from(reportContent.keys())}
            disabled={reportContent.size < 2}
          >
            {sortedSections.map(([uid]) => (
              <ReportContentElement
                key={uid}
                sectionId={sectionId}
                contentId={uid}
                entityId={entityId}
                entityType={entityType}
              />
            ))}
          </SortableContext>
          {reportContent.size > 1 && !!draggingElement && (
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
                sectionId={sectionId}
                contentId={draggingElement}
                entityId={entityId}
                entityType={entityType}
              />
            </DragOverlay>
          )}
        </DndContext>
      </Grid>
    </Box>
  )
}
