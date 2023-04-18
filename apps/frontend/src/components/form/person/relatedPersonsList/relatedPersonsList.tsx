import Stack from '@mui/material/Stack'
import React, { useCallback } from 'react'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { ConnectedEntity, PersonAPIOutput } from 'defs'
import { PersonsList } from '@frontend/components/list/personsList'
import { useModal } from '@frontend/components/modal/modalProvider'

type Props = {
  personId: string
  relatedPersons: Set<string>
  personsInfo: Map<string, PersonAPIOutput>
  updateRelatedPersons: (relatedPersons: ConnectedEntity[]) => void
}

export const RelatedPersonsList: React.FunctionComponent<Props> = ({
  personId,
  relatedPersons,
  personsInfo,
  updateRelatedPersons,
}) => {
  const modal = useModal()

  const addPersons = useCallback(
    () =>
      modal.openPersonSelector(
        (personsIds) => {
          updateRelatedPersons(personsIds.map((_id) => ({ _id })))
        },
        [personId, ...Array.from(relatedPersons)],
      ),
    [relatedPersons, personId],
  )

  const removePerson = (personId) =>
    useCallback(() => {
      relatedPersons.delete(personId)
      updateRelatedPersons(Array.from(relatedPersons).map((_id) => ({ _id: _id })))
    }, [updateRelatedPersons])

  return (
    <PersonsList label={'Related persons'} personsInfo={personsInfo} removePerson={removePerson}>
      <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} width={1} height={1}>
        <AddOutlinedIcon fontSize={'large'} onClick={addPersons} />
      </Stack>
    </PersonsList>
  )
}
