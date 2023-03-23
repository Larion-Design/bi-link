import React, { useEffect } from 'react'
import { ReportAPIInput } from 'defs'
import { Document, Page } from '@react-pdf/renderer'
import { getFilesInfoRequest } from '../../graphql/files/getFilesInfo'
import { GeneratePreviewHandler, useDataRefs } from '../../utils/hooks/useDataRefProcessor'
import { CoverPage } from './coverPage'
import { Header } from './header'
import { ImagesList } from './imagesList'
import { Link } from './link'
import { Paragraph } from './paragraph'
import { Title } from './title'

type Props = {
  reportInfo: ReportAPIInput
  transform: GeneratePreviewHandler
}

export const ReportDocument: React.FunctionComponent<Props> = ({ reportInfo }) => {
  const { name, sections, type, person, company, property, event } = reportInfo
  const { transform } = useDataRefs(reportInfo.refs)
  const [fetchFilesInfo, { data: filesInfo }] = getFilesInfoRequest()

  useEffect(() => {
    const filesIds = new Set<string>()

    reportInfo.sections.forEach(({ content }) => {
      content.map(({ file, images }) => {
        if (file) {
          filesIds.add(file.fileId)
        }
        if (images) {
          images?.forEach(({ fileId }) => filesIds.add(fileId))
        }
      })
    })

    if (filesIds.size) {
      void fetchFilesInfo({ variables: { filesIds: Array.from(filesIds) } })
    }
  }, [reportInfo])

  return (
    <Document title={name} subject={type} language={'ro'}>
      <CoverPage reportName={name} />

      {sections.map(({ content, name }) => (
        <Page key={name} wrap break>
          <Header />
          {content.map(({ order, text, title, table, graph, images, file, link }) => {
            if (text) {
              const { content } = text
              return <Paragraph key={order} text={transform(content)} />
            }
            if (title) {
              const { content } = title
              return <Title key={order} title={transform(content)} />
            }
            if (link) {
              const { label, url } = link
              return <Link key={order} url={url} label={transform(label)} />
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
