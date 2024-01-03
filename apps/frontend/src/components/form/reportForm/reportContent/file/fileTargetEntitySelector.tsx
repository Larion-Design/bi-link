import React, { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { EntityInfo, EntityType, FileAPIInput } from 'defs'
import { getCompanyInfoRequest } from '@frontend/graphql/companies/queries/getCompany'
import { getEventRequest } from '@frontend/graphql/events/queries/getEvent'
import { getPersonInfoRequest } from '@frontend/graphql/persons/queries/getPersonInfo'
import { getPropertyRequest } from '@frontend/graphql/properties/queries/getProperty'
import { Graph } from '../../../../entityViews/graph'
import { useModal } from '../../../../modal/modalProvider'

type Props = {
  entityId: string
  selectedFile: FileAPIInput | null
  updateFile: (fileInfo: FileAPIInput | null) => void
}

export const FileTargetEntitySelector: React.FunctionComponent<Props> = ({
  entityId,
  selectedFile,
  updateFile,
}) => {
  const modal = useModal()
  const [selectedEntity, selectEntity] = useState<EntityInfo | null>(null)
  const [fetchPerson, { data: personInfo }] = getPersonInfoRequest()
  const [fetchProperty, { data: propertyInfo }] = getPropertyRequest()
  const [fetchCompany, { data: companyInfo }] = getCompanyInfoRequest()
  const [fetchIncident, { data: eventInfo }] = getEventRequest()

  const openFileSelector = useCallback(
    (files: FileAPIInput[], selectedFile: FileAPIInput | null) =>
      modal.openFileSelector(files, updateFile, selectedFile, () => selectEntity(null)),
    [selectEntity, updateFile, selectedFile],
  )

  useEffect(() => {
    const files = personInfo?.getPersonInfo?.files.filter(({ isHidden }) => !isHidden)

    if (files?.length) {
      openFileSelector(files, selectedFile)
    }
  }, [personInfo?.getPersonInfo?.files])

  useEffect(() => {
    const files = propertyInfo?.getProperty?.files.filter(({ isHidden }) => !isHidden)

    if (files?.length) {
      openFileSelector(files, selectedFile)
    }
  }, [propertyInfo?.getProperty?.files])

  useEffect(() => {
    const files = companyInfo?.getCompany?.files.filter(({ isHidden }) => !isHidden)

    if (files?.length) {
      openFileSelector(files, selectedFile)
    }
  }, [companyInfo?.getCompany?.files])

  useEffect(() => {
    const files = eventInfo?.getEvent?.files.filter(({ isHidden }) => !isHidden)

    if (files?.length) {
      openFileSelector(files, selectedFile)
    }
  }, [eventInfo?.getEvent?.files])

  useEffect(() => {
    if (selectedEntity) {
      const { entityId, entityType } = selectedEntity

      switch (entityType) {
        case 'PERSON': {
          void fetchPerson({ variables: { personId: entityId } })
          break
        }
        case 'PROPERTY': {
          void fetchProperty({ variables: { propertyId: entityId } })
          break
        }
        case 'COMPANY': {
          void fetchCompany({ variables: { id: entityId } })
          break
        }
        case 'EVENT': {
          void fetchIncident({ variables: { eventId: entityId } })
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
    <Box sx={{ height: '50vh' }}>
      <Graph
        entityId={entityId}
        depth={1}
        onEntitySelected={entitySelectedHandler}
        disableTitle={true}
        disableMap={true}
      />
    </Box>
  )
}
