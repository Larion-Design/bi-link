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
}

export const ReportContentElement: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  contentInfo,
  updateContentInfo,
  removeContent,
  generateTextPreview,
}) => {
  const [expanded, setExpandedState] = useState(false)
  const toggleAccordion = useCallback(
    () => setExpandedState((expanded) => !expanded),
    [setExpandedState],
  )

  const getContentElement = () => {
    if (contentInfo.link) {
      return (
        <ContentElementContainer title={'Link'} removeContent={removeContent}>
          <ReportContentLink
            linkInfo={contentInfo.link}
            updateLink={(linkInfo) => updateContentInfo({ ...contentInfo, link: linkInfo })}
            generateTextPreview={generateTextPreview}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.text) {
      return (
        <ContentElementContainer title={'Text'} removeContent={removeContent}>
          <ReportContentText
            textInfo={contentInfo.text}
            updateText={(textInfo) => updateContentInfo({ ...contentInfo, text: textInfo })}
            generateTextPreview={generateTextPreview}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.title) {
      return (
        <ContentElementContainer title={'Text'} removeContent={removeContent}>
          <ReportContentTitle
            titleInfo={contentInfo.title}
            updateTitle={(titleInfo) => updateContentInfo({ ...contentInfo, title: titleInfo })}
            generateTextPreview={generateTextPreview}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.images) {
      return (
        <ContentElementContainer title={'Imagini'} removeContent={removeContent}>
          <ReportContentImages
            entityId={entityId}
            selectedImages={contentInfo.images}
            updateImages={(images) => updateContentInfo({ ...contentInfo, images })}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.file) {
      return (
        <ContentElementContainer title={'Fisier'} removeContent={removeContent}>
          <ReportContentFile
            entityId={entityId}
            fileInfo={contentInfo.file}
            updateFile={(file) => updateContentInfo({ ...contentInfo, file })}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.table) {
      return (
        <ContentElementContainer title={'Tabel'} removeContent={removeContent}>
          <ReportContentTable
            entityId={entityId}
            entityType={entityType}
            tableInfo={contentInfo.table}
            updateTable={(table) => updateContentInfo({ ...contentInfo, table })}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.graph) {
      return (
        <ContentElementContainer title={'Grafic relational'} removeContent={removeContent}>
          <ReportContentGraph
            entityId={entityId}
            graphInfo={contentInfo.graph}
            updateGraph={(graph) => updateContentInfo({ ...contentInfo, graph })}
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
