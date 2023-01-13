import React, { useMemo, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import { EntityType, ReportContentAPIInput } from 'defs'
import { ReportContentFile } from './reportContent/reportContentFile'
import { ContentElementContainer } from './reportContent/reportContentContainer'
import { ReportContentGraph } from './reportContent/reportContentGraph'
import { ReportContentImages } from './reportContent/reportContentImages'
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
}

export const ReportContentElement: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  contentInfo,
  updateContentInfo,
  removeContent,
}) => {
  const [expanded, setExpandedState] = useState(false)

  const contentElement = useMemo(() => {
    if (contentInfo.link) {
      return (
        <ContentElementContainer title={'Link'} removeContent={removeContent}>
          <ReportContentLink
            linkInfo={contentInfo.link}
            updateLink={(linkInfo) => updateContentInfo({ ...contentInfo, link: linkInfo })}
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
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.images) {
      return (
        <ContentElementContainer title={'Imagini'} removeContent={removeContent}>
          <ReportContentImages
            images={[]}
            selectedImages={contentInfo.images}
            updateImages={(images) => updateContentInfo({ ...contentInfo, images })}
          />
        </ContentElementContainer>
      )
    }
    if (contentInfo.file) {
      return (
        <ContentElementContainer title={'Imagini'} removeContent={removeContent}>
          <ReportContentFile fileInfo={contentInfo.file} />
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
          ></ReportContentGraph>
        </ContentElementContainer>
      )
    }
    return null
  }, [contentInfo])

  return (
    <Accordion
      variant={'outlined'}
      expanded={expanded}
      onChange={() => setExpandedState((expanded) => !expanded)}
    >
      {contentElement}
    </Accordion>
  )
}
