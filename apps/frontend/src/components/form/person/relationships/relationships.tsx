import React, { useCallback, useEffect } from 'react'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import { FormattedMessage } from 'react-intl'
import { RelationshipAPI } from 'defs'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { getDefaultRelationship } from 'tools'
import { RelationshipCard } from './relationshipCard'
import { useModal } from '../../../modal/modalProvider'
import { useDebouncedMap } from '@frontend/utils/hooks/useMap'
import { AddItemButton } from '@frontend/components/button/addItemButton'

type Props<T = RelationshipAPI> = {
  personId?: string
  relationships: T[]
  updateRelationships: (relationships: T[]) => Promise<void>
  readonly?: boolean
}

export const Relationships: React.FunctionComponent<Props> = ({
  relationships,
  updateRelationships,
  personId,
}) => {
  const modal = useModal()
  const getPersonId = ({ person: { _id } }: RelationshipAPI) => _id
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
      (personsIds: string[]) => addBulk(personsIds.map(getDefaultRelationship), getPersonId),
      personsIds,
    )
  }, [uid])

  return (
    <Stack divider={<Divider variant={'fullWidth'} flexItem />}>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant={'h5'}>
          <FormattedMessage
            id={'Personal relationships'}
            defaultMessage={'Personal relationships'}
          />
        </Typography>

        <AddItemButton
          label={'Adauga persoana in cercul relational'}
          onClick={openPersonSelector}
        />
      </Stack>

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
