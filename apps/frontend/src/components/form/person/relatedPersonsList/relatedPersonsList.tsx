import { PersonsList } from '@frontend/components/list/personsList'
import React, { useCallback, useEffect } from 'react'
import { ConnectedEntity, PersonListRecordWithImage } from 'defs'
import { RemovePerson } from '@frontend/components/actionButton/removePerson'
import { useModal } from '@frontend/components/modal/modalProvider'
import { useMap } from '@frontend/utils/hooks/useMap'
import { getPersonFullName } from '@frontend/utils/person'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import { FormattedMessage } from 'react-intl'

type Props = {
  personId: string
  relatedPersons: ConnectedEntity[]
  personsInfo: PersonListRecordWithImage[]
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
      <Box
        sx={{
          width: 1,
          height: 100,
          display: 'flex',
          flexWrap: 'nowrap',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AddOutlinedIcon fontSize={'large'} onClick={addPersons} />
      </Box>
    </PersonsList>
  )
}
