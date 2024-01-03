import React from 'react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { FormattedMessage } from 'react-intl'
import { InputField } from '../../inputField'
import { ProceedingEntityInvolvedAPI } from 'defs'

type Props<T = ProceedingEntityInvolvedAPI> = {
  partyId: string
  partyInfo: T
  updateParty: (partyId: string, partyInfo: T) => void
}

export const PartyCardGeneralInformation: React.FunctionComponent<Props> = ({
  partyId,
  partyInfo,
  updateParty,
}) => (
  <Stack sx={{ width: 1 }}>
    <Typography variant={'h6'}>
      <FormattedMessage id={'General Information'} />
    </Typography>

    <Stack mt={1} spacing={2}>
      <InputField
        label={'Calitate'}
        value={partyInfo.involvedAs}
        onChange={(involvedAs) => updateParty(partyId, { ...partyInfo, involvedAs })}
      />

      <InputField
        label={'Descriere'}
        value={partyInfo.description}
        multiline
        rows={7}
        onChange={(value) => updateParty(partyId, { ...partyInfo, description: value })}
      />
    </Stack>
  </Stack>
)
