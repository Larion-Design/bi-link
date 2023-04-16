import React, { useCallback, useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { EventParticipantAPI } from 'defs'
import { getDefaultParticipant } from 'tools'
import { PartyCard } from './partyCard'
import { useMap } from '@frontend/utils/hooks/useMap'

type Props<T = EventParticipantAPI> = {
  parties: T[]
  updateParties: (parties: T[]) => void | Promise<void>
}

export const Parties: React.FunctionComponent<Props> = ({ parties, updateParties }) => {
  const { uid, entries, values, add, remove, update } = useMap(parties)

  useEffect(() => {
    void updateParties(values())
  }, [uid])

  const createIncident = useCallback(() => add(getDefaultParticipant()), [])

  return (
    <>
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'baseline'}>
        <Tooltip title={'Adaugă o noua parte implicata in incident.'}>
          <Button variant={'contained'} onClick={createIncident}>
            <AddOutlinedIcon />
          </Button>
        </Tooltip>
      </Box>
      <Stack spacing={2}>
        {parties.length ? (
          entries().map(([partyId, partyInfo]) => (
            <PartyCard
              key={partyId}
              partyId={partyId}
              partyInfo={partyInfo}
              updateParty={update}
              removeParty={remove}
            />
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
      </Stack>
    </>
  )
}
