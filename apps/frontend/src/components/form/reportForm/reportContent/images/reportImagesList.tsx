import React, { useEffect, useMemo } from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Image from 'mui-image'
import { EntityType, FileAPIInput, FileAPIOutput } from 'defs'
import { getFilesInfoRequest } from '../../../../../graphql/files/getFilesInfo'
import { imageTypeRegex } from '../../../../../utils/mimeTypes'

type Props = {
  entityId?: string
  entityType?: EntityType
  images: FileAPIInput[]
  setImages: (images: FileAPIInput[]) => void
}

export const ReportImagesList: React.FunctionComponent<Props> = ({ images }) => {
  const [fetchFiles, { data }] = getFilesInfoRequest()

  useEffect(() => {
    const imagesIds = images.filter(({ isHidden }) => !isHidden).map(({ fileId }) => fileId)

    if (imagesIds.length) {
      void fetchFiles({ variables: { filesIds: imagesIds } })
    }
  }, [images])

  const imagesInfo: FileAPIOutput[] = useMemo(() => {
    if (data?.getFilesInfo) {
      return data?.getFilesInfo?.filter(({ mimeType }) => imageTypeRegex.test(mimeType))
    }
    return []
  }, [data?.getFilesInfo])

  return imagesInfo.length > 0 ? (
    <ImageList variant={'standard'} cols={3} gap={8}>
      {imagesInfo.map(({ fileId, name, url: { url } }) => (
        <ImageListItem key={fileId}>
          <Image alt={name} src={url} />
        </ImageListItem>
      ))}
    </ImageList>
  ) : null
}
