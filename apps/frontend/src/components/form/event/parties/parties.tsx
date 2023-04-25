import React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useEventState } from '../../../../state/eventState'
import { PartyCard } from './partyCard'

export const Parties: React.FunctionComponent = () => {
  const { parties, addParticipant } = useEventState()

  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'baseline'}>
        <Tooltip title={'Adaugă o noua parte implicata in incident.'}>
          <Button variant={'contained'} onClick={addParticipant}>
            <AddOutlinedIcon />
          </Button>
        </Tooltip>
      </Stack>

      <Stack spacing={2}>
        {parties.size ? (
          Array.from(parties.keys()).map((uid) => <PartyCard key={uid} partyId={uid} />)
        ) : (
          <NoParticipantsPlaceholder />
        )}
      </Stack>
    </>
  )
}

const NoParticipantsPlaceholder: React.FunctionComponent = () => (
  <Box
    sx={{
      width: 1,
      height: 200,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Typography variant={'body2'}>Nu ai adăugat nicio parte implicata in incident.</Typography>
  </Box>
)
