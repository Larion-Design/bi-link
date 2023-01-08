import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { Reports } from '../entityViews/reports'
import { InputFieldMenu } from '../menu/inputFieldMenu'
import { IncidentAPIInput } from 'defs'
import { IncidentForm } from '../form/incidentForm'
import { Graph } from '../entityViews/graph'

type Props = {
  incidentId?: string
  incidentInfo?: IncidentAPIInput
  readonly: boolean
  onSubmit: (data: IncidentAPIInput) => void | Promise<void>
}

export const IncidentDetails: React.FunctionComponent<Props> = ({
  incidentId,
  incidentInfo,
  readonly,
  onSubmit,
}) => {
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
        <Typography variant={'h5'} data-cy={'pageTitle'} gutterBottom>
          {!!incidentId && !!incidentInfo ? 'Detalii despre incident' : 'Creaza un incident'}
        </Typography>
        {!!incidentId && (
          <InputFieldMenu label={'Optiuni'}>
            <MenuItem onClick={() => setMainTabIndex(0)}>Informatii</MenuItem>
            <MenuItem disabled={!incidentId} onClick={() => setMainTabIndex(1)}>
              Grafic relational
            </MenuItem>
            <MenuItem onClick={() => setMainTabIndex(3)}>Rapoarte</MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(2)}>
              Evenimente
            </MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(4)}>
              Conflicte
            </MenuItem>
          </InputFieldMenu>
        )}
      </Box>
      <Box sx={{ width: 1 }}>
        {mainTabIndex === 0 && (
          <IncidentForm
            incidentId={incidentId}
            incidentInfo={incidentInfo}
            readonly={readonly}
            onSubmit={onSubmit}
          />
        )}
        {mainTabIndex === 1 && !!incidentId && <Graph entityId={incidentId} />}
        {mainTabIndex === 3 && !!incidentId && (
          <Reports entityId={incidentId} entityType={'INCIDENT'} />
        )}
      </Box>
    </Box>
  )
}
