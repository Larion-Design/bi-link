import React, { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { EntityInfo, EntityType, FileAPIInput } from 'defs'
import { getPersonInfoRequest } from '@frontend/graphql/persons/queries/getPersonInfo'
import { getPropertyRequest } from '@frontend/graphql/properties/queries/getProperty'
import { Graph } from '../../../../entityViews/graph'
import { useModal } from '../../../../modal/modalProvider'

type Props = {
  entityId?: string
  entityType?: EntityType
  selectedImages: FileAPIInput[]
  updateImages: (images: FileAPIInput[]) => void
}

export const ImagesTargetEntitySelector: React.FunctionComponent<Props> = ({
  entityId,
  selectedImages,
  updateImages,
}) => {
  const modal = useModal()
  const [selectedEntity, selectEntity] = useState<EntityInfo | null>(null)
  const [fetchPersonInfo, { data: personInfo }] = getPersonInfoRequest()
  const [fetchPropertyInfo, { data: propertyInfo }] = getPropertyRequest()

  const openImagesSelector = useCallback(
    (images: FileAPIInput[], selectedImages: FileAPIInput[]) =>
      modal.openImageSelector(images, updateImages, selectedImages, () => selectEntity(null)),
    [selectEntity, updateImages],
  )

  useEffect(() => {
    if (personInfo?.getPersonInfo?.images?.length) {
      openImagesSelector(personInfo.getPersonInfo.images, selectedImages)
    }
  }, [personInfo?.getPersonInfo?.images])

  useEffect(() => {
    if (propertyInfo?.getProperty?.images?.length) {
      openImagesSelector(propertyInfo.getProperty.images, selectedImages)
    }
  }, [propertyInfo?.getProperty?.images])

  useEffect(() => {
    if (selectedEntity) {
      const { entityId, entityType } = selectedEntity

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
  }, [selectedEntity])

  const entitySelectedHandler = useCallback(
    (entityId: string, entityType: EntityType) => selectEntity({ entityId, entityType }),
    [selectEntity],
  )

  return (
    <Box sx={{ height: '30vh' }}>
      <Graph
        entityId={entityId}
        depth={1}
        onEntitySelected={entitySelectedHandler}
        disableControls={true}
        disableMap={true}
        disableTitle={true}
      />
    </Box>
  )
}
