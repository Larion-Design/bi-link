import Box from '@mui/material/Box'
import React, { useCallback, useEffect, useMemo } from 'react'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { FormattedMessage } from 'react-intl'
import { PersonAPIOutput } from 'defs'
import { getPersonsBasicInfoRequest } from 'api/persons/queries/getPersonsBasicInfo'
import { usePersonState } from 'state/personState'
import { RelationshipCard } from './relationshipCard'
import { useModal } from '../../../modal/modalProvider'
import { AddItemButton } from '@frontend/components/button/addItemButton'

type Props = {
  personId?: string
}

export const Relationships: React.FunctionComponent<Props> = ({ personId }) => {
  const [relationships, updateRelationship, addRelationships, removeRelationships] = usePersonState(
    ({ relationships, updateRelationship, addRelationships, removeRelationships }) => [
      relationships,
      updateRelationship,
      addRelationships,
      removeRelationships,
    ],
  )
  const modal = useModal()
  const [fetchPersonsInfo, { data }] = getPersonsBasicInfoRequest()

  const personsInfo = useMemo(() => {
    if (data?.getPersonsInfo) {
      const map = new Map<string, PersonAPIOutput>()
      data.getPersonsInfo.map((personInfo) => map.set(personInfo._id, personInfo))
      return map
    }
  }, [data])

  useEffect(() => {
    const personsIds = new Set<string>()

    relationships.forEach(({ person: { _id }, relatedPersons }) => {
      personsIds.add(_id)
      relatedPersons.forEach(({ _id }) => personsIds.add(_id))
    })

    if (personsIds.size) {
      void fetchPersonsInfo({ variables: { personsIds: Array.from(personsIds) } })
    }
  }, [relationships])

  const openPersonSelector = useCallback(() => {
    const personsIds = new Set<string>(Array.from(relationships.keys()))
    if (personId) {
      personsIds.add(personId)
    }
    modal?.openPersonSelector(addRelationships, Array.from(personsIds))
  }, [relationships])

  const removeRelationship = useCallback(
    (personId: string) => removeRelationships([personId]),
    [removeRelationships],
  )

  return (
    <Stack width={1}>
      <Stack width={1} direction={'row'} justifyContent={'space-between'} mb={5}>
        <Typography variant={'h5'}>
          <FormattedMessage id={'Personal relationships'} />
        </Typography>

        <Box>
          <AddItemButton
            label={'Adauga persoana in cercul relational'}
            onClick={openPersonSelector}
          />
        </Box>
      </Stack>

      <Stack spacing={6} minHeight={'30vh'}>
        {!!personsInfo &&
          Array.from(relationships.entries()).map(([personId, relationship]) => {
            const personInfo = personsInfo?.get(personId)
            return personInfo ? (
              <RelationshipCard
                key={personId}
                personInfo={personInfo}
                personsInfo={personsInfo}
                relationshipInfo={relationship}
                updateRelationship={updateRelationship}
                removeRelationship={removeRelationship}
              />
            ) : null
          })}
      </Stack>
    </Stack>
  )
}
