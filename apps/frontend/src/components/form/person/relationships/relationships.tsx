import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import React, { useCallback, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { RelationshipAPIInput } from 'defs'
import { createRelationship } from '@frontend/components/form/person/constants'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { RelationshipCard } from './relationshipCard'
import { useModal } from '../../../modal/modalProvider'
import { useDebouncedMap } from '@frontend/utils/hooks/useMap'
import { AddItemButton } from '@frontend/components/button/addItemButton'

type Props = {
  personId?: string
  relationships: RelationshipAPIInput[]
  updateRelationships: (relationships: RelationshipAPIInput[]) => Promise<void>
  readonly?: boolean
}

export const Relationships: React.FunctionComponent<Props> = ({
  relationships,
  updateRelationships,
  personId,
}) => {
  const modal = useModal()
  const getPersonId = ({ person: { _id } }: RelationshipAPIInput) => _id
  const [fetchPersonsInfo, { data }] = getPersonsBasicInfoRequest()
  const { entries, values, addBulk, update, remove, keys, uid } = useDebouncedMap(
    1000,
    relationships,
    getPersonId,
  )

  useEffect(() => {
    const personsIds = new Set<string>()

    values().map(({ person: { _id }, relatedPersons }) => {
      personsIds.add(_id)
      relatedPersons.forEach(({ _id }) => personsIds.add(_id))
    })

    if (personsIds.size) {
      void fetchPersonsInfo({ variables: { personsIds: Array.from(personsIds) } })
    }
    void updateRelationships(values())
  }, [uid])

  const openPersonSelector = useCallback(() => {
    const personsIds = keys()
    if (personId) {
      personsIds.push(personId)
    }

    modal?.openPersonSelector(
      (personsIds: string[]) => addBulk(personsIds.map(createRelationship), getPersonId),
      personsIds,
    )
  }, [uid])

  return (
    <Stack sx={{ width: 1 }}>
      <Box
        sx={{ width: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <Typography variant={'h5'}>
          <FormattedMessage
            id={'Personal relationships'}
            defaultMessage={'Personal relationships'}
          />
        </Typography>

        <Box>
          <AddItemButton
            label={'Adauga persoana in cercul relational'}
            onClick={openPersonSelector}
          />
        </Box>
      </Box>
      <Divider variant={'fullWidth'} sx={{ mb: 2, mt: 2 }} />
      <Stack spacing={6}>
        {!!data?.getPersonsInfo?.length &&
          entries().map(([personId, relationship]) => {
            const personInfo = data.getPersonsInfo.find(({ _id }) => _id === personId)
            return personInfo ? (
              <RelationshipCard
                key={personId}
                personInfo={personInfo}
                relatedPersonsInfo={data.getPersonsInfo.filter(
                  ({ _id }) =>
                    !!relationship.relatedPersons.find(
                      ({ _id: relatedPersonId }) => relatedPersonId === _id,
                    ),
                )}
                relationshipInfo={relationship}
                updateRelationship={update}
                removeRelationship={remove}
              />
            ) : null
          })}
      </Stack>
    </Stack>
  )
}
