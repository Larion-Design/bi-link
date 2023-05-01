import React, { useEffect } from 'react'
import { Document, Page } from '@react-pdf/renderer'
import { getFilesInfoRequest } from '../../graphql/files/getFilesInfo'
import { useReportState } from '../../state/report/reportState'
import { CoverPage } from './coverPage'
import { Header } from './header'
import { ImagesList } from './imagesList'
import { Link } from './link'
import { Paragraph } from './paragraph'
import { Title } from './title'

export const ReportDocument: React.FunctionComponent = () => {
  const {
    name,
    sections,
    type,
    person,
    company,
    property,
    event,
    reportContent,
    computeRefsValues,
  } = useReportState()
  const [fetchFilesInfo, { data: filesInfo }] = getFilesInfoRequest()

  useEffect(() => {
    if (reportContent.size) {
      const filesIds = new Set<string>()

      reportContent.forEach(({ file, images }) => {
        if (file) {
          filesIds.add(file.fileId)
        }
        if (images) {
          images?.forEach(({ fileId }) => filesIds.add(fileId))
        }
      })

      if (filesIds.size) {
        void fetchFilesInfo({ variables: { filesIds: Array.from(filesIds) } })
      }
    }
  }, [reportContent])

  return (
    <Document title={name} subject={type} language={'ro'}>
      <CoverPage reportName={name} />

      {sections.map(({ content, name }) => (
        <Page key={name} wrap break>
          <Header />
          {content.map(({ order, text, title, table, graph, images, file, link }) => {
            if (text) {
              const { content } = text
              return <Paragraph key={order} text={computeRefsValues(content)} />
            }
            if (title) {
              const { content } = title
              return <Title key={order} title={computeRefsValues(content)} />
            }
            if (link) {
              const { label, url } = link
              return <Link key={order} url={url} label={computeRefsValues(label)} />
            }
            if (images) {
              const imagesInfo = filesInfo?.getFilesInfo.filter(
                ({ fileId }) => !!images.find(({ fileId: imageFileId }) => imageFileId === fileId),
              )

              if (imagesInfo?.length) {
                return <ImagesList key={order} images={imagesInfo} />
              }
            }
            if (graph) {
              graph.label
            }
            return null
          })}
        </Page>
      ))}
    </Document>
  )
}
