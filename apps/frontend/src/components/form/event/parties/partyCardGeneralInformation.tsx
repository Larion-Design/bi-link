import React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { EventParticipantAPI } from 'defs'
import { FormattedMessage } from 'react-intl'
import { useEventState } from '../../../../state/eventState'
import { InputField } from '../../inputField'

type Props = {
  partyId: string
}

export const PartyCardGeneralInformation: React.FunctionComponent<Props> = ({ partyId }) => {
  const { parties, updateParticipantType, updateParticipantDescription } = useEventState()
  const { type, description } = parties.get(partyId)

  return (
    <Box sx={{ width: 1 }}>
      <Box>
        <Typography variant={'h6'}>
          <FormattedMessage id={'General Information'} />
        </Typography>
      </Box>
      <Stack mt={1} spacing={2}>
        <InputField
          label={'Nume'}
          value={type}
          onChange={(type) => updateParticipantType(partyId, type)}
        />

        <InputField
          label={'Descriere'}
          value={description}
          multiline
          rows={7}
          onChange={(description) => updateParticipantDescription(partyId, description)}
        />
      </Stack>
    </Box>
  )
}
