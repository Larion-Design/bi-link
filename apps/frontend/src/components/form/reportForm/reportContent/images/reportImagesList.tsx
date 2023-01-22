import React, { useEffect, useMemo } from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Image from 'mui-image'
import { FileAPIInput, FileAPIOutput } from 'defs'
import { getFilesInfoRequest } from '../../../../../graphql/files/getFilesInfo'

type Props = {
  images: FileAPIInput[]
  setImages: (images: FileAPIInput[]) => void
}

export const ReportImagesList: React.FunctionComponent<Props> = ({ images }) => {
  const [fetchFiles, { data }] = getFilesInfoRequest()

  useEffect(() => {
    const imagesIds = images.filter(({ isHidden }) => !isHidden).map(({ fileId }) => fileId)

    if (imagesIds.length) {
      void fetchFiles({
        variables: {
          filesIds: imagesIds,
        },
      })
    }
  }, [images])

  const imagesInfo: FileAPIOutput[] | null = useMemo(() => {
    if (data?.getFilesInfo) {
      const regex = new RegExp(/(^image)(\/)[a-zA-Z0-9_]*/gm)
      return data?.getFilesInfo.filter(({ mimeType }) => regex.test(mimeType))
    }
    return null
  }, [data?.getFilesInfo])

  return (
    <ImageList variant={'standard'} cols={3} gap={8}>
      {imagesInfo?.map(({ fileId, name, url: { url } }) => (
        <ImageListItem key={fileId}>
          <Image alt={name} src={url} />
        </ImageListItem>
      ))}
    </ImageList>
  )
}
