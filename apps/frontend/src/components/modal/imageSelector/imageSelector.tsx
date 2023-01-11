import React, { useCallback, useEffect } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Image from 'mui-image'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import { FileAPIInput } from 'defs'
import { getFilesInfoRequest } from '../../../graphql/files/getFilesInfo'
import { useMap } from '../../../utils/hooks/useMap'
import { ModalHeader } from '../modalHeader'

type Props = {
  closeModal: () => void
  images: FileAPIInput[]
  selectImages: (images: FileAPIInput[]) => void
  selectedImages: FileAPIInput[]
}

export const ImageSelector: React.FunctionComponent<Props> = ({
  images,
  closeModal,
  selectImages,
  selectedImages,
}) => {
  const [fetchFilesInfo, { data }] = getFilesInfoRequest()
  const { map: allImages } = useMap(images, ({ fileId }) => fileId)
  const { uid, values, add, remove, map } = useMap(selectedImages, ({ fileId }) => fileId)

  useEffect(() => {
    if (images.length) {
      void fetchFilesInfo({ variables: { filesIds: images.map(({ fileId }) => fileId) } })
    }
  }, [images])

  const submitSelectedImages = useCallback(() => {
    const selectedImages = values()
    if (selectedImages.length) {
      selectImages(selectedImages)
    }
    closeModal?.()
  }, [closeModal, selectImages, uid])

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      <ModalHeader title={'Imagini'} closeModal={closeModal} />
      <CardContent sx={{ height: '85%', overflow: 'auto' }}>
        {data ? (
          <ImageList variant={'standard'} cols={3} gap={8}>
            {data.getFilesInfo.map(({ fileId, url: { url } }) => (
              <ImageListItem
                key={fileId}
                sx={{ position: 'relative' }}
                onClick={() => {
                  if (allImages.has(fileId)) {
                    remove(fileId)
                  } else add(allImages.get(fileId), ({ fileId }) => fileId)
                }}
              >
                {map.has(fileId) && (
                  <BookmarkAddedIcon
                    color={'success'}
                    sx={{ position: 'absolute', top: 2, right: 2 }}
                  />
                )}
                <Image src={url} />
              </ImageListItem>
            ))}
          </ImageList>
        ) : null}
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant={'contained'}
          color={'primary'}
          disabled={!map.size}
          onClick={submitSelectedImages}
        >
          Selectează
        </Button>
        <Button variant={'outlined'} color={'error'} onClick={closeModal} sx={{ mr: 2 }}>
          Inchide
        </Button>
      </CardActions>
    </Card>
  )
}
