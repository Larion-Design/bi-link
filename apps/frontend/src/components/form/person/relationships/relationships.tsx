import React, { useCallback, useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { getPersonsBasicInfoRequest } from '@frontend/graphql/persons/queries/getPersonsBasicInfo'
import { AddItemCard } from '../../addItemCard'
import { PersonCard } from './personCard'
import { useModal } from '../../../modal/modalProvider'
import { RelationshipAPIInput } from 'defs'
import { useDebouncedMap } from '@frontend/utils/hooks/useMap'

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
  const [fetchPersonsInfo, { data }] = getPersonsBasicInfoRequest()
  const { entries, values, addBulk, update, remove, keys, uid } = useDebouncedMap(
    1000,
    relationships,
    ({ person: { _id } }) => _id,
  )

  useEffect(() => {
    const personsIds = keys()

    if (personsIds.length) {
      void fetchPersonsInfo({ variables: { personsIds } })
    }
    void updateRelationships(values())
  }, [uid])

  const openPersonSelector = useCallback(() => {
    const personsIds = keys()
    if (personId) {
      personsIds.push(personId)
    }

    modal?.openPersonSelector(
      (personsIds: string[]) =>
        addBulk(personsIds.map(createRelationship), ({ person: { _id } }) => _id),
      personsIds,
    )
  }, [uid])

  return (
    <>
      <Grid container spacing={6}>
        {!!data?.getPersonsInfo?.length &&
          entries().map(([personId, relationship]) => {
            const personInfo = data.getPersonsInfo.find(({ _id }) => _id === personId)
            return personInfo ? (
              <Grid key={personId} item xs={4}>
                <PersonCard
                  personInfo={personInfo}
                  relationshipInfo={relationship}
                  updateRelationship={update}
                  removeRelationship={remove}
                />
              </Grid>
            ) : null
          })}

        <Grid item xs={3}>
          <AddItemCard data-cy={'openPersonsModalButton'} onClick={openPersonSelector} />
        </Grid>
      </Grid>
    </>
  )
}

const createRelationship = (_id: string): RelationshipAPIInput => ({
  person: { _id },
  type: '',
  proximity: 1,
  _confirmed: true,
})
