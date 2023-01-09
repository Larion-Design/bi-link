import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Image from 'mui-image'
import { FileAPIInput } from 'defs'
import { getDownloadUrlsRequest } from '../../../graphql/shared/queries/getDownloadUrls'
import { imageTypeRegex } from '../../../utils/mimeTypes'
import { FileUploadBox } from '../../form/fileField/FileUploadBox'
import { ModalHeader } from '../modalHeader'

type Props = {
  images: FileAPIInput[]
  setImages: (images: FileAPIInput[]) => void
  closeModal: () => void
}

export const ImageGallery: React.FunctionComponent<Props> = ({ images, setImages, closeModal }) => {
  const [uploadedImages, setUploadedImages] = useState(images)
  const [fetchImages, { data }] = getDownloadUrlsRequest()

  useEffect(() => {
    if (uploadedImages.length) {
      void fetchImages({
        variables: {
          filesIds: uploadedImages.map(({ fileId }) => fileId),
        },
      })
    }
  }, [uploadedImages])

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      <ModalHeader title={'Imagini'} closeModal={closeModal} />
      <CardContent sx={{ height: '85%', overflow: 'auto' }}>
        <FileUploadBox
          addUploadedFile={(image) => {
            const uploadedImages = [...images, image]
            setImages(uploadedImages)
            setUploadedImages(uploadedImages)
          }}
          acceptedFileTypes={imageTypeRegex}
        >
          {data ? (
            <ImageList variant={'masonry'} cols={3} gap={8}>
              {data.getDownloadUrls.map((imageUrl) => (
                <ImageListItem key={imageUrl}>
                  <Image src={imageUrl} />
                </ImageListItem>
              ))}
            </ImageList>
          ) : null}
        </FileUploadBox>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant={'outlined'} color={'error'} onClick={closeModal} sx={{ mr: 2 }}>
          Inchide
        </Button>
      </CardActions>
    </Card>
  )
}
