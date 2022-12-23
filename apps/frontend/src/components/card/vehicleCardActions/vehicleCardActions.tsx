import React, { PropsWithChildren } from 'react'
import Box from '@mui/material/Box'
import { CardActions } from '@mui/material'
import { RemovePerson } from '../../actionButton/removePerson'
import { ViewVehiclePage } from '../../actionButton/viewVehiclePage'

type Props = {
  name: string
  vehicleId: string
  onRemove: () => void
}

export const VehicleCardActions: React.FunctionComponent<
  PropsWithChildren<Props>
> = ({ vehicleId, name, onRemove, children }) => (
  <CardActions
    sx={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Box display={'flex'}>{children}</Box>
    <Box display={'flex'}>
      <ViewVehiclePage vehicleId={vehicleId} name={name} />
      <RemovePerson name={name} onRemove={onRemove} />
    </Box>
  </CardActions>
)
