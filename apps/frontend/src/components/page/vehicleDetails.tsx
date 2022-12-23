import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { InputFieldMenu } from '../menu/inputFieldMenu'
import { VehicleAPIInput } from '../../types/vehicle'
import { VehicleForm } from '../form/vehicleForm'

type Props = {
  vehicleId?: string
  vehicleInfo?: VehicleAPIInput
  readonly: boolean
  onSubmit: (data: VehicleAPIInput) => void | Promise<void>
}

export const VehicleDetails: React.FunctionComponent<Props> = ({
  vehicleId,
  vehicleInfo,
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
          {!!vehicleId && !!vehicleInfo
            ? `Detalii despre ${vehicleInfo.maker} ${vehicleInfo.model}`
            : 'Creaza un vehicul'}
        </Typography>
        {!!vehicleId && (
          <InputFieldMenu label={'Optiuni'}>
            <MenuItem onClick={() => setMainTabIndex(0)}>Informatii</MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(1)}>
              Grafic relational
            </MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(2)}>
              Evenimente
            </MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(3)}>
              Rapoarte
            </MenuItem>
            <MenuItem disabled onClick={() => setMainTabIndex(4)}>
              Conflicte
            </MenuItem>
          </InputFieldMenu>
        )}
      </Box>
      <Box sx={{ width: 1 }}>
        {mainTabIndex === 0 && (
          <VehicleForm
            vehicleId={vehicleId}
            vehicleInfo={vehicleInfo}
            readonly={readonly}
            onSubmit={onSubmit}
          />
        )}
      </Box>
    </Box>
  )
}
