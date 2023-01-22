import Box from '@mui/material/Box'
import { EntityInfo, FileAPIInput } from 'defs'
import React, { useCallback, useEffect, useState } from 'react'
import { getCompanyInfoRequest } from '../../../../../graphql/companies/queries/getCompany'
import { getIncidentRequest } from '../../../../../graphql/incidents/queries/getIncident'
import { getPersonInfoRequest } from '../../../../../graphql/persons/queries/getPersonInfo'
import { getPropertyRequest } from '../../../../../graphql/properties/queries/getProperty'
import { Graph } from '../../../../entityViews/graph'
import { useModal } from '../../../../modal/modalProvider'

type Props = {
  entityId
  entityType
  selectedImages: FileAPIInput[]
  updateImages: (images: FileAPIInput[]) => void
}

export const ImagesTargetEntitySelector: React.FunctionComponent<Props> = ({
  entityId,
  entityType,
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

  return (
    <Box sx={{ width: 1 }}>
      <Graph
        entityId={entityId}
        depth={1}
        onEntitySelected={(entityId, entityType) => selectEntity({ entityId, entityType })}
      />
    </Box>
  )
}
