import React, { useCallback, useEffect, useState } from 'react'
import Divider from '@mui/material/Divider'
import { EntityInfo, EntityType } from 'defs'
import { getCompanyInfoRequest } from '../../../../graphql/companies/queries/getCompany'
import { getIncidentRequest } from '../../../../graphql/incidents/queries/getIncident'
import { getPersonInfoRequest } from '../../../../graphql/persons/queries/getPersonInfo'
import { getPropertyRequest } from '../../../../graphql/properties/queries/getProperty'
import { BasicDrawer } from '../../../drawer/basicDrawer'
import { CompanyInfoDrawer } from '../../../drawer/entityInfoDrawer/companyInfoDrawer'
import { IncidentInfoDrawer } from '../../../drawer/entityInfoDrawer/incidentInfoDrawer'
import { PersonInfoDrawer } from '../../../drawer/entityInfoDrawer/personInfoDrawer'
import { PropertyInfoDrawer } from '../../../drawer/entityInfoDrawer/propertyInfoDrawer'
import { Graph } from '../../graph'

type Props = {
  entityId: string
  entityType: EntityType
}

export const ReportDrawer: React.FunctionComponent<Props> = ({ entityId, entityType }) => {
  const [selectedEntity, setEntitySelected] = useState<EntityInfo>({ entityId, entityType })
  const [fetchPerson, { data: personData }] = getPersonInfoRequest()
  const [fetchCompany, { data: companyData }] = getCompanyInfoRequest()
  const [fetchProperty, { data: propertyData }] = getPropertyRequest()
  const [fetchIncident, { data: incidentData }] = getIncidentRequest()

  const selectEntity = useCallback(
    (entityId: string, entityType: EntityType) => setEntitySelected({ entityId, entityType }),
    [setEntitySelected],
  )

  useEffect(() => {
    switch (entityType) {
      case 'PERSON': {
        void fetchPerson({ variables: { personId: entityId } })
        break
      }
      case 'COMPANY': {
        void fetchCompany({ variables: { id: entityId } })
        break
      }
      case 'PROPERTY': {
        void fetchProperty({ variables: { propertyId: entityId } })
        break
      }
      case 'INCIDENT': {
        void fetchIncident({ variables: { incidentId: entityId } })
        break
      }
    }
  }, [entityId, entityType])

  return (
    <BasicDrawer>
      <Graph depth={1} entityId={selectedEntity.entityId} onEntitySelected={selectEntity} />
      <Divider />
      {entityType === 'PERSON' && (
        <PersonInfoDrawer
          personId={selectedEntity.entityId}
          personInfo={personData.getPersonInfo}
        />
      )}
      {entityType === 'COMPANY' && (
        <CompanyInfoDrawer
          companyId={selectedEntity.entityId}
          companyInfo={companyData.getCompany}
        />
      )}
      {entityType === 'PROPERTY' && (
        <PropertyInfoDrawer
          propertyId={selectedEntity.entityId}
          propertyInfo={propertyData.getProperty}
        />
      )}
      {entityType === 'INCIDENT' && (
        <IncidentInfoDrawer
          incidentId={selectedEntity.entityId}
          incidentInfo={incidentData.getIncident}
        />
      )}
    </BasicDrawer>
  )
}
