import { ProceedingForm } from '@frontend/components/form/proceeding/proceedingForm/proceedingForm'
import React, { useState } from 'react'
import { Graph } from '@frontend/components/entityViews/graph'
import { Reports } from '@frontend/components/entityViews/reports'
import { InputFieldMenu } from '@frontend/components/menu/inputFieldMenu'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { ProceedingAPIInput } from 'defs'

type Props = {
  proceedingId?: string
  proceedingInfo?: ProceedingAPIInput
  onSubmit: (data: ProceedingAPIInput) => void | Promise<void>
}

export const ProceedingDetails: React.FunctionComponent<Props> = ({
  proceedingId,
  proceedingInfo,
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
          {!!proceedingId && !!proceedingInfo ? 'Detalii despre event' : 'Creaza un event'}
        </Typography>
        {!!proceedingId && (
          <InputFieldMenu label={'Optiuni'}>
            <MenuItem onClick={() => setMainTabIndex(0)}>Informatii</MenuItem>
            <MenuItem disabled={!proceedingId} onClick={() => setMainTabIndex(1)}>
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
          <ProceedingForm
            proceedingId={proceedingId}
            proceedingInfo={proceedingInfo}
            onSubmit={onSubmit}
          />
        )}
        {mainTabIndex === 1 && !!proceedingId && (
          <Box sx={{ height: '70vh' }}>
            <Graph entityId={proceedingId} />
          </Box>
        )}
        {mainTabIndex === 3 && !!proceedingId && (
          <Reports entityId={proceedingId} entityType={'PROCEEDING'} />
        )}
      </Box>
    </Box>
  )
}
