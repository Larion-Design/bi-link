import React, { useCallback } from 'react'
import { ConnectedEntity } from '../../../types/connectedEntity'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { PersonListRecordWithImage } from '../../../types/person'
import { PartyEntity } from './partyEntity'
import { generatePath, useNavigate } from 'react-router-dom'
import { routes } from '../../../router/routes'
import { getPersonFullName } from '../../../utils/person'
import { PartyPersonInfo } from './partyEntityInfo/partyPersonInfo'
import { PartyEntitiesPlaceholder } from './partyEntitiesPlaceholder'

type Props = {
  persons: ConnectedEntity[]
  personsInfo?: PersonListRecordWithImage[]
  removePerson: (personId: string) => void
}

export const PartyPersons: React.FunctionComponent<Props> = ({
  persons,
  personsInfo,
  removePerson,
}) => {
  const navigate = useNavigate()
  const viewPersonDetails = useCallback(
    (personId: string) =>
      navigate(generatePath(routes.personDetails, { personId })),
    [navigate],
  )
  return (
    <>
      <Box sx={{ width: 1, mb: 2 }}>
        <Typography variant={'h6'}>Persoane</Typography>
      </Box>
      {!!persons.length ? (
        persons.map(({ _id }) => {
          const personInfo = personsInfo?.find(
            ({ _id: personId }) => personId === _id,
          )
          if (personInfo) {
            const fullName = getPersonFullName(personInfo)
            const { _id, image, cnp } = personInfo
            return (
              <PartyEntity
                key={_id}
                entityId={_id}
                viewEntityDetails={viewPersonDetails}
                removeEntity={removePerson}
              >
                <PartyPersonInfo
                  name={fullName}
                  cnp={cnp}
                  imageUrl={image?.url?.url ?? ''}
                />
              </PartyEntity>
            )
          }
          return null
        })
      ) : (
        <PartyEntitiesPlaceholder placeholder={'Nu exista persoane.'} />
      )}
    </>
  )
}
