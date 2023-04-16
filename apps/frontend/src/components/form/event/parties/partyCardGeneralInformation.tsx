import React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { EventParticipantAPI } from 'defs'
import { FormattedMessage } from 'react-intl'
import { InputField } from '../../inputField'

type Props<T = EventParticipantAPI> = {
  partyId: string
  partyInfo: T
  updateParty: (partyId: string, partyInfo: T) => void
}

export const PartyCardGeneralInformation: React.FunctionComponent<Props> = ({
  partyId,
  partyInfo,
  updateParty,
}) => (
  <Box sx={{ width: 1 }}>
    <Box>
      <Typography variant={'h6'}>
        <FormattedMessage id={'General Information'} />
      </Typography>
    </Box>
    <Stack mt={1} spacing={2}>
      <InputField
        label={'Nume'}
        value={partyInfo.type}
        onChange={(value) => updateParty(partyId, { ...partyInfo, type: value })}
      />

      <InputField
        label={'Descriere'}
        value={partyInfo.description}
        multiline
        rows={7}
        onChange={(value) => updateParty(partyId, { ...partyInfo, description: value })}
      />
    </Stack>
  </Box>
)
