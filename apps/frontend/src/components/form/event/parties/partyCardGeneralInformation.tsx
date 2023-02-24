import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { InputField } from '../../inputField'
import { PartyAPI } from 'defs'

type Props = {
  partyId: string
  partyInfo: PartyAPI
  updateParty: (partyId: string, partyInfo: PartyAPI) => void
}

export const PartyCardGeneralInformation: React.FunctionComponent<Props> = ({
  partyId,
  partyInfo,
  updateParty,
}) => (
  <Box sx={{ width: 1 }}>
    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
      <Typography variant={'h6'}>Informatii generale</Typography>
    </Box>
    <Grid container mt={1} spacing={2}>
      <Grid item xs={12}>
        <InputField
          label={'Nume'}
          value={partyInfo.name}
          onChange={(value) =>
            updateParty(partyId, {
              ...partyInfo,
              name: value,
            })
          }
        />
      </Grid>

      <Grid item xs={12}>
        <InputField
          label={'Descriere'}
          value={partyInfo.description}
          multiline
          rows={7}
          onChange={(value) =>
            updateParty(partyId, {
              ...partyInfo,
              description: value,
            })
          }
        />
      </Grid>
    </Grid>
  </Box>
)
