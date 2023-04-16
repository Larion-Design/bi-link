import Stack from '@mui/material/Stack'
import React, { useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import { ConnectedEntity, PersonAPIOutput } from 'defs'
import { PersonsList } from '@frontend/components/list/personsList'
import { useModal } from '@frontend/components/modal/modalProvider'
import { useMap } from '@frontend/utils/hooks/useMap'

type Props = {
  personId: string
  relatedPersons: ConnectedEntity[]
  personsInfo: PersonAPIOutput[]
  updateRelatedPersons: (relatedPersons: ConnectedEntity[]) => void
}

export const RelatedPersonsList: React.FunctionComponent<Props> = ({
  personId,
  relatedPersons,
  personsInfo,
  updateRelatedPersons,
}) => {
  const modal = useModal()
  const { addBulk, remove, values, uid } = useMap(relatedPersons, ({ _id }) => _id)

  useEffect(() => {
    updateRelatedPersons(values())
  }, [uid])

  const addPersons = useCallback(
    () =>
      modal.openPersonSelector(
        (personsIds) => addBulk(personsIds.map((_id) => ({ _id }))),
        [personId, ...relatedPersons.map(({ _id }) => _id)],
      ),
    [relatedPersons, personId],
  )

  return (
    <PersonsList label={'Related persons'} personsInfo={[]} removePerson={remove}>
      <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} width={1} height={1}>
        <AddOutlinedIcon fontSize={'large'} onClick={addPersons} />
      </Stack>
    </PersonsList>
  )
}
