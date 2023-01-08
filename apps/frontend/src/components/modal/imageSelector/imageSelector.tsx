import React, { useCallback, useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Image from 'mui-image'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import { EntityType } from 'defs'
import { getEntityImages } from '../../../graphql/shared/queries/getEntityImages'
import { ModalHeader } from '../modalHeader'

type Props = {
  entityId: string
  entityType: EntityType
  closeModal: () => void
  imagesSelected: (filesIds: string[]) => void
}

export const ImageSelector: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
  closeModal,
  imagesSelected,
}) => {
  const { data } = getEntityImages(entityId, entityType)
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  useEffect(() => setSelectedImages([]), [entityId, entityType])

  const submitSelectedImages = () => {
    if (selectedImages.length) {
      imagesSelected(selectedImages)
    }
    closeModal?.()
  }

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      <ModalHeader title={'Imagini'} closeModal={closeModal} />
      <CardContent sx={{ height: '85%', overflow: 'auto' }}>
        {data ? (
          <ImageList variant={'standard'} cols={3} gap={8}>
            {data.getEntityImages.map(({ fileId, url: { url } }) => (
              <ImageListItem
                key={fileId}
                sx={{ position: 'relative' }}
                onClick={() =>
                  setSelectedImages((selectedImages) => {
                    const set = new Set(selectedImages)

                    if (set.has(fileId)) {
                      set.delete(fileId)
                    } else set.add(fileId)

                    return Array.from(set)
                  })
                }
              >
                {selectedImages.includes(fileId) && (
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
          disabled={!selectedImages.length}
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
