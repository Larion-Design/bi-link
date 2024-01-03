import React, { useCallback, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import { useSortable } from '@dnd-kit/sortable'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined'
import { EntityType } from 'defs'
import { useReportState } from '../../../state/report/reportState'
import { ReportContentFile } from './reportContent/file/reportContentFile'
import { ReportContentGraph } from './reportContent/reportContentGraph'
import { ReportContentImages } from './reportContent/images/reportContentImages'
import { ReportContentLink } from './reportContent/reportContentLink'
import { ReportContentTable } from './reportContent/reportContentTable'
import { ReportContentText } from './reportContent/reportContentText'
import { ReportContentTitle } from './reportContent/reportContentTitle'

type Props = {
  sectionId: string
  contentId: string
  entityId?: string
  entityType?: EntityType
}

export const ReportContentElement: React.FunctionComponent<Props> = ({
  sectionId,
  contentId,
  entityId,
  entityType,
}) => {
  const [expanded, setExpandedState] = useState(false)
  const toggleAccordion = useCallback(
    () => setExpandedState((expanded) => !expanded),
    [setExpandedState],
  )
  const { transition, listeners, attributes, setNodeRef, setActivatorNodeRef, isSorting } =
    useSortable({
      id: contentId,
      disabled: expanded,
    })

  const [contentInfo, updateContent, removeContent] = useReportState(
    ({ reportContent, updateContent, removeContent }) => [
      reportContent.get(contentId),
      updateContent,
      removeContent,
    ],
  )

  const getContentElementTitle = () => {
    if (contentInfo.link) {
      return 'Link'
    }
    if (contentInfo.text) {
      return 'Text'
    }
    if (contentInfo.images) {
      return 'Imagini'
    }
    if (contentInfo.title) {
      return 'Titlu'
    }
    if ('file' in contentInfo) {
      return 'Fisier'
    }
    if (contentInfo.table) {
      return 'Tabel'
    }
    if (contentInfo.graph) {
      return 'Grafic relational'
    }
  }

  const getContentElement = () => {
    const remove = () => removeContent(sectionId, contentId)

    if (contentInfo.link) {
      return (
        <ReportContentLink
          linkInfo={contentInfo.link}
          updateLink={(linkInfo) => updateContent(contentId, { ...contentInfo, link: linkInfo })}
          removeContent={remove}
        />
      )
    }
    if (contentInfo.text) {
      return (
        <ReportContentText
          textInfo={contentInfo.text}
          updateText={(textInfo) => updateContent(contentId, { ...contentInfo, text: textInfo })}
          removeContent={remove}
        />
      )
    }
    if (contentInfo.title) {
      return (
        <ReportContentTitle
          titleInfo={contentInfo.title}
          updateTitle={(titleInfo) =>
            updateContent(contentId, { ...contentInfo, title: titleInfo })
          }
          removeContent={remove}
        />
      )
    }
    if (contentInfo.images) {
      return (
        <ReportContentImages
          entityId={entityId}
          entityType={entityType}
          selectedImages={contentInfo.images}
          updateImages={(images) => updateContent(contentId, { ...contentInfo, images })}
          removeContent={remove}
        />
      )
    }
    if ('file' in contentInfo) {
      return (
        <ReportContentFile
          entityId={entityId}
          entityType={entityType}
          fileInfo={contentInfo.file}
          updateFile={(file) => updateContent(contentId, { ...contentInfo, file })}
          removeContent={remove}
        />
      )
    }
    if (contentInfo.table) {
      return (
        <ReportContentTable
          entityId={entityId}
          entityType={entityType}
          tableInfo={contentInfo.table}
          updateTable={(table) => updateContent(contentId, { ...contentInfo, table })}
          removeContent={remove}
        />
      )
    }
    if (contentInfo.graph) {
      return (
        <ReportContentGraph
          entityId={entityId}
          graphInfo={contentInfo.graph}
          updateGraph={(graph) => updateContent(contentId, { ...contentInfo, graph })}
          removeContent={remove}
        />
      )
    }
    return null
  }

  if (!contentInfo) {
    return null
  }
  return (
    <Grid
      item
      xs={12}
      ref={setNodeRef}
      sx={{ width: 1 }}
      style={{
        opacity: isSorting ? 0.4 : undefined,
        transition,
      }}
    >
      <Accordion
        variant={'outlined'}
        expanded={expanded}
        onChange={toggleAccordion}
        TransitionProps={{ unmountOnExit: true }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ display: 'flex', alignItems: 'center', alignContent: 'center' }}
        >
          <IconButton ref={setActivatorNodeRef} {...listeners} {...attributes}>
            <DragIndicatorOutlinedIcon fontSize={'small'} />
          </IconButton>
          <Typography variant={'subtitle1'}>{getContentElementTitle()}</Typography>
        </AccordionSummary>
        {getContentElement()}
      </Accordion>
    </Grid>
  )
}
