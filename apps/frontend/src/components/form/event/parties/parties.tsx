import React, { useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { PartyAPI } from 'defs'
import { PartyCard } from './partyCard'
import { useMap } from '@frontend/utils/hooks/useMap'

type Props = {
  parties: PartyAPI[]
  updateParties: (parties: PartyAPI[]) => void | Promise<void>
}

export const Parties: React.FunctionComponent<Props> = ({ parties, updateParties }) => {
  const { uid, entries, values, add, remove, update } = useMap(parties)

  useEffect(() => {
    void updateParties(values())
  }, [uid])

  const createIncident = useCallback(() => add(createIncidentParty()), [])

  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
        <Tooltip title={'Adaugă o noua parte implicata in incident.'}>
          <Button variant={'contained'} onClick={createIncident}>
            <AddOutlinedIcon />
          </Button>
        </Tooltip>
      </Box>
      <Grid container spacing={2}>
        {parties.length ? (
          entries().map(([partyId, partyInfo]) => (
            <Grid key={partyId} item xs={12}>
              <PartyCard
                partyId={partyId}
                partyInfo={partyInfo}
                updateParty={update}
                removeParty={remove}
              />
            </Grid>
          ))
        ) : (
          <Box
            sx={{
              width: 1,
              height: 200,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant={'body2'}>
              Nu ai adăugat nicio parte implicata in incident.
            </Typography>
          </Box>
        )}
      </Grid>
    </>
  )
}

const createIncidentParty = (): PartyAPI => ({
  name: '',
  description: '',
  persons: [],
  companies: [],
  properties: [],
  customFields: [],
  _confirmed: true,
})
