import React, { useCallback, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import { EntityType, ReportContentAPIInput } from 'defs'
import { GeneratePreviewHandler } from '../../../utils/hooks/useDataRefProcessor'
import { ReportContentFile } from './reportContent/file/reportContentFile'
import { ContentElementContainer } from './reportContent/reportContentContainer'
import { ReportContentGraph } from './reportContent/reportContentGraph'
import { ReportContentImages } from './reportContent/images/reportContentImages'
import { ReportContentLink } from './reportContent/reportContentLink'
import { ReportContentTable } from './reportContent/reportContentTable'
import { ReportContentText } from './reportContent/reportContentText'
import { ReportContentTitle } from './reportContent/reportContentTitle'

type Props = {
  entityId?: string
  entityType?: EntityType
  contentInfo: ReportContentAPIInput
  updateContentInfo: (contentInfo: ReportContentAPIInput) => void
  removeContent: () => void
  generateTextPreview: GeneratePreviewHandler
  graphCreated: (graphId: string) => void
  graphRemoved: (graphId: string) => void
}

export const ReportContentElement: React.FunctionComponent<Props> = ({
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

  const getContentElement = () => {
    if (contentInfo.link) {
      return (
        <ContentElementContainer title={'Link'} open={expanded}>
          <ReportContentLink
            linkInfo={contentInfo.link}
            updateLink={(linkInfo) => updateContentInfo({ ...contentInfo, link: linkInfo })}
            generateTextPreview={generateTextPreview}
            removeContent={removeContent}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.text) {
      return (
        <ContentElementContainer title={'Text'} open={expanded}>
          <ReportContentText
            textInfo={contentInfo.text}
            updateText={(textInfo) => updateContentInfo({ ...contentInfo, text: textInfo })}
            generateTextPreview={generateTextPreview}
            removeContent={removeContent}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.title) {
      return (
        <ContentElementContainer title={'Titlu'} open={expanded}>
          <ReportContentTitle
            titleInfo={contentInfo.title}
            updateTitle={(titleInfo) => updateContentInfo({ ...contentInfo, title: titleInfo })}
            generateTextPreview={generateTextPreview}
            removeContent={removeContent}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.images) {
      return (
        <ContentElementContainer title={'Imagini'} open={expanded}>
          <ReportContentImages
            entityId={entityId}
            entityType={entityType}
            selectedImages={contentInfo.images}
            updateImages={(images) => updateContentInfo({ ...contentInfo, images })}
            removeContent={removeContent}
          />
        </ContentElementContainer>
      )
    }
    if ('file' in contentInfo) {
      return (
        <ContentElementContainer title={'Fisier'} open={expanded}>
          <ReportContentFile
            entityId={entityId}
            entityType={entityType}
            fileInfo={contentInfo.file}
            updateFile={(file) => updateContentInfo({ ...contentInfo, file })}
            removeContent={removeContent}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.table) {
      return (
        <ContentElementContainer title={'Tabel'} open={expanded}>
          <ReportContentTable
            entityId={entityId}
            entityType={entityType}
            tableInfo={contentInfo.table}
            updateTable={(table) => updateContentInfo({ ...contentInfo, table })}
            removeContent={removeContent}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.graph) {
      return (
        <ContentElementContainer title={'Grafic relational'} open={expanded}>
          <ReportContentGraph
            entityId={entityId}
            graphInfo={contentInfo.graph}
            updateGraph={(graph) => updateContentInfo({ ...contentInfo, graph })}
            removeContent={removeContent}
            graphCreated={graphCreated}
            graphRemoved={graphRemoved}
          />
        </ContentElementContainer>
      )
    }
    return null
  }

  return (
    <Accordion variant={'outlined'} expanded={expanded} onChange={toggleAccordion}>
      {getContentElement()}
    </Accordion>
  )
}
