import React, { useCallback, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import { useSortable } from '@dnd-kit/sortable'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import DragIndicatorOutlinedIcon from '@mui/icons-material/DragIndicatorOutlined'
import { EntityType, ReportContentAPIInput } from 'defs'
import { GeneratePreviewHandler } from '../../../utils/hooks/useDataRefProcessor'
import { ReportContentFile } from './reportContent/file/reportContentFile'
import { ReportContentGraph } from './reportContent/reportContentGraph'
import { ReportContentImages } from './reportContent/images/reportContentImages'
import { ReportContentLink } from './reportContent/reportContentLink'
import { ReportContentTable } from './reportContent/reportContentTable'
import { ReportContentText } from './reportContent/reportContentText'
import { ReportContentTitle } from './reportContent/reportContentTitle'

type Props<T = ReportContentAPIInput> = {
  contentInfo: T
  updateContentInfo: (contentInfo: T) => void
  contentId: string
  entityId?: string
  entityType?: EntityType
  removeContent: () => void
  generateTextPreview: GeneratePreviewHandler
  graphCreated: (graphId: string) => void
  graphRemoved: (graphId: string) => void
}

export const ReportContentElement: React.FunctionComponent<Props> = ({
  contentId,
  entityId,
  entityType,
  contentInfo,
  updateContentInfo,
  removeContent,
  generateTextPreview,
  graphCreated,
  graphRemoved,
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
    if (contentInfo.link) {
      return (
        <ReportContentLink
          linkInfo={contentInfo.link}
          updateLink={(linkInfo) => updateContentInfo({ ...contentInfo, link: linkInfo })}
          generateTextPreview={generateTextPreview}
          removeContent={removeContent}
        />
      )
    }
    if (contentInfo.text) {
      return (
        <ReportContentText
          textInfo={contentInfo.text}
          updateText={(textInfo) => updateContentInfo({ ...contentInfo, text: textInfo })}
          generateTextPreview={generateTextPreview}
          removeContent={removeContent}
        />
      )
    }
    if (contentInfo.title) {
      return (
        <ReportContentTitle
          titleInfo={contentInfo.title}
          updateTitle={(titleInfo) => updateContentInfo({ ...contentInfo, title: titleInfo })}
          generateTextPreview={generateTextPreview}
          removeContent={removeContent}
        />
      )
    }
    if (contentInfo.images) {
      return (
        <ReportContentImages
          entityId={entityId}
          entityType={entityType}
          selectedImages={contentInfo.images}
          updateImages={(images) => updateContentInfo({ ...contentInfo, images })}
          removeContent={removeContent}
        />
      )
    }
    if ('file' in contentInfo) {
      return (
        <ReportContentFile
          entityId={entityId}
          entityType={entityType}
          fileInfo={contentInfo.file}
          updateFile={(file) => updateContentInfo({ ...contentInfo, file })}
          removeContent={removeContent}
        />
      )
    }
    if (contentInfo.table) {
      return (
        <ReportContentTable
          entityId={entityId}
          entityType={entityType}
          tableInfo={contentInfo.table}
          updateTable={(table) => updateContentInfo({ ...contentInfo, table })}
          removeContent={removeContent}
        />
      )
    }
    if (contentInfo.graph) {
      return (
        <ReportContentGraph
          entityId={entityId}
          graphInfo={contentInfo.graph}
          updateGraph={(graph) => updateContentInfo({ ...contentInfo, graph })}
          removeContent={removeContent}
          graphCreated={graphCreated}
          graphRemoved={graphRemoved}
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
