import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import React, { useCallback, useEffect } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import AccordionActions from '@mui/material/AccordionActions'
import AccordionDetails from '@mui/material/AccordionDetails'
import { EntityType, FileAPIInput } from 'defs'
import { getPersonInfoRequest } from '@frontend/graphql/persons/queries/getPersonInfo'
import { getPropertyRequest } from '@frontend/graphql/properties/queries/getProperty'
import { ActionButton } from '../../../../button/actionButton'
import { useModal } from '../../../../modal/modalProvider'
import { ImagesTargetEntitySelector } from './imagesTargetEntitySelector'
import { ReportImagesList } from './reportImagesList'

type Props = {
  entityId?: string
  entityType?: EntityType
  selectedImages: FileAPIInput[]
  updateImages: (images: FileAPIInput[]) => void
  removeContent: () => void
}

export const ReportContentImages: React.FunctionComponent<Props> = ({
  selectedImages,
  updateImages,
  entityId,
  entityType,
  removeContent,
}) => {
  const modal = useModal()
  const [fetchPersonInfo, { data: personInfo }] = getPersonInfoRequest()
  const [fetchPropertyInfo, { data: propertyInfo }] = getPropertyRequest()

  const openImagesSelector = useCallback(
    (images: FileAPIInput[], selectedImages: FileAPIInput[]) =>
      modal.openImageSelector(images, updateImages, selectedImages),
    [entityId, updateImages, selectedImages],
  )

  useEffect(() => {
    if (entityId && entityType) {
      switch (entityType) {
        case 'PERSON': {
          void fetchPersonInfo({ variables: { personId: entityId } })
          break
        }
        case 'PROPERTY': {
          void fetchPropertyInfo({ variables: { propertyId: entityId } })
          break
        }
      }
    }
  }, [entityId, entityType])

  const handleAddImageAction = useCallback(() => {
    if (personInfo?.getPersonInfo?.images?.length) {
      openImagesSelector(personInfo.getPersonInfo.images, selectedImages)
    }
    if (propertyInfo?.getProperty?.images?.length) {
      openImagesSelector(propertyInfo.getProperty.images, selectedImages)
    }
  }, [personInfo?.getPersonInfo?.images, propertyInfo?.getProperty?.images, selectedImages])

  return (
    <>
      <AccordionDetails>
        {!!entityId && (
          <ImagesTargetEntitySelector
            entityId={entityId}
            entityType={entityType}
            selectedImages={selectedImages}
            updateImages={updateImages}
          />
        )}

        <ReportImagesList
          entityId={entityId}
          entityType={entityType}
          images={selectedImages}
          setImages={updateImages}
        />
      </AccordionDetails>
      <AccordionActions>
        <ActionButton
          disabled={!entityId && !entityType}
          icon={<AddPhotoAlternateOutlinedIcon color={'primary'} />}
          onClick={handleAddImageAction}
          label={'Adaugă imagini'}
        />
        <ActionButton
          icon={<DeleteOutlinedIcon color={'error'} />}
          onClick={removeContent}
          label={'Sterge element'}
        />
      </AccordionActions>
    </>
  )
}
