import React, { useEffect } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import CardContent from '@mui/material/CardContent'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Image from 'mui-image'
import { FileAPIInput } from 'defs'
import { getDownloadUrlsRequest } from '../../../graphql/shared/queries/getDownloadUrls'
import { ModalHeader } from '../modalHeader'

type Props = {
  images: FileAPIInput[]
  closeModal: () => void
}

export const ImageGallery: React.FunctionComponent<Props> = ({ images, closeModal }) => {
  const [fetchImages, { data }] = getDownloadUrlsRequest()

  useEffect(() => {
    if (images.length) {
      void fetchImages({
        variables: {
          filesIds: images.map(({ fileId }) => fileId),
        },
      })
    }
  }, [images])

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      <ModalHeader title={'Imagini'} closeModal={closeModal} />
      <CardContent sx={{ height: '85%', overflow: 'auto' }}>
        {data ? (
          <ImageList variant={'standard'} cols={3} gap={8}>
            {data.getDownloadUrls.map((imageUrl) => (
              <ImageListItem key={imageUrl}>
                <Image src={imageUrl} />
              </ImageListItem>
            ))}
          </ImageList>
        ) : null}
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant={'outlined'} color={'error'} onClick={closeModal} sx={{ mr: 2 }}>
          Inchide
        </Button>
      </CardActions>
    </Card>
  )
}
