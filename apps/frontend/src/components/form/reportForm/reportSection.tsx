import React, { useCallback, useState } from 'react'
import { Editor } from '@frontend/components/editor'
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

  const openDialogToRemoveSection = useCallback(
    () =>
      dialog.openDialog({
        title: 'Esti sigur ca vrei sa stergi acest capitol?',
        description: 'Tot continutul din capitol nu mai poate fi recuperat.',
        onConfirm: () => removeSection(sectionId),
      }),
    [dialog, removeSection],
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
        <Editor data={[]} />
      </Grid>
    </Box>
  )
}
