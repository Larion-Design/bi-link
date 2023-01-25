import React, { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { EntityInfo, EntityType, FileAPIInput } from 'defs'
import { getCompanyInfoRequest } from '../../../../../graphql/companies/queries/getCompany'
import { getIncidentRequest } from '../../../../../graphql/incidents/queries/getIncident'
import { getPersonInfoRequest } from '../../../../../graphql/persons/queries/getPersonInfo'
import { getPropertyRequest } from '../../../../../graphql/properties/queries/getProperty'
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
  const [fetchIncident, { data: incidentInfo }] = getIncidentRequest()

  const openFileSelector = useCallback(
    (files: FileAPIInput[], selectedFile: FileAPIInput | null) =>
      modal.openFileSelector(files, updateFile, selectedFile, () => selectEntity(null)),
    [selectEntity, updateFile],
  )

  useEffect(() => {
    const files = personInfo?.getPersonInfo?.files.filter(({ isHidden }) => !isHidden)

    if (files.length) {
      openFileSelector(files, selectedFile)
    }
  }, [personInfo?.getPersonInfo?.files])

  useEffect(() => {
    const files = propertyInfo?.getProperty?.files.filter(({ isHidden }) => !isHidden)

    if (files.length) {
      openFileSelector(files, selectedFile)
    }
  }, [propertyInfo?.getProperty?.files])

  useEffect(() => {
    const files = companyInfo?.getCompany?.files.filter(({ isHidden }) => !isHidden)

    if (files.length) {
      openFileSelector(files, selectedFile)
    }
  }, [companyInfo?.getCompany?.files])

  useEffect(() => {
    const files = incidentInfo?.getIncident?.files.filter(({ isHidden }) => !isHidden)

    if (files.length) {
      openFileSelector(files, selectedFile)
    }
  }, [incidentInfo?.getIncident?.files])

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
        case 'INCIDENT': {
          void fetchIncident({ variables: { incidentId: entityId } })
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
    <Box sx={{ width: 1 }}>
      <Graph entityId={entityId} depth={1} onEntitySelected={entitySelectedHandler} />
    </Box>
  )
}
