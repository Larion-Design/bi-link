import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { Reports } from '../entityViews/reports'
import { InputFieldMenu } from '../menu/inputFieldMenu'
import { EventAPIInput } from 'defs'
import { EventForm } from '../form/event/eventForm'
import { Graph } from '../entityViews/graph'

type Props = {
  eventId?: string
  eventInfo?: EventAPIInput
  onSubmit: (data: EventAPIInput) => void
}

export const EventDetails: React.FunctionComponent<Props> = ({ eventId, eventInfo, onSubmit }) => {
  const [mainTabIndex, setMainTabIndex] = useState(0)

  return (
    <Box sx={{ width: 1, p: 4, mt: 2 }}>
      <Box
        sx={{
          width: 1,
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant={'h5'} data-testid={'pageTitle'} gutterBottom>
          {!!eventId && !!eventInfo ? 'Detalii despre eveniment' : 'Creaza un eveniment'}
        </Typography>
        {!!eventId && (
          <InputFieldMenu label={'Optiuni'}>
            <MenuItem onClick={() => setMainTabIndex(0)}>Informatii</MenuItem>
            <MenuItem disabled={!eventId} onClick={() => setMainTabIndex(1)}>
              Grafic relational
            </MenuItem>
            <MenuItem onClick={() => setMainTabIndex(3)}>Rapoarte</MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(4)}>
              Conflicte
            </MenuItem>
          </InputFieldMenu>
        )}
      </Box>
      <Box sx={{ width: 1 }}>
        {mainTabIndex === 0 && <EventForm eventId={eventId} onSubmit={onSubmit} />}
        {mainTabIndex === 1 && !!eventId && (
          <Box sx={{ height: '70vh' }}>
            <Graph entityId={eventId} />
          </Box>
        )}
        {mainTabIndex === 3 && !!eventId && <Reports entityId={eventId} entityType={'EVENT'} />}
      </Box>
    </Box>
  )
}
