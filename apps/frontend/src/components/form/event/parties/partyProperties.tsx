import React, { useCallback } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { PropertyAPIOutput } from 'defs'
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../../../router/routes'
import { PartyEntity } from './partyEntity'
import { PartyEntitiesPlaceholder } from './partyEntitiesPlaceholder'
import { PartyPropertyInfo } from './partyEntityInfo/partyPropertyInfo'

type Props = {
  properties: Set<string>
  propertiesInfo?: Map<string, PropertyAPIOutput>
  removeProperty: (propertyId: string) => void
}

export const PartyProperties: React.FunctionComponent<Props> = ({
  properties,
  propertiesInfo,
  removeProperty,
}) => {
  const navigate = useNavigate()
  const viewPropertyDetails = useCallback(
    (propertyId: string) => navigate(generatePath(routes.propertyDetails, { propertyId })),
    [navigate],
  )
  return (
    <>
      <Box sx={{ width: 1, mb: 2 }}>
        <Typography variant={'h6'}>Proprietati</Typography>
      </Box>
      {properties.size > 0 ? (
        Array.from(properties).map((_id) => {
          const propertyInfo = propertiesInfo?.get(_id)
          if (propertyInfo) {
            const { _id, name, type } = propertyInfo
            return (
              <PartyEntity
                key={_id}
                entityId={_id}
                viewEntityDetails={viewPropertyDetails}
                removeEntity={removeProperty}
              >
                <PartyPropertyInfo name={name} type={type} />
              </PartyEntity>
            )
          }
          return null
        })
      ) : (
        <PartyEntitiesPlaceholder placeholder={'Nu exista proprietati.'} />
      )}
    </>
  )
}
