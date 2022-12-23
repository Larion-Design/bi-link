import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { PartyVehicle } from './partyVehicle'
import { ConnectedEntity } from '../../../types/connectedEntity'
import { VehicleListRecord } from '../../../types/vehicle'

type Props = {
  vehicles: ConnectedEntity[]
  vehiclesInfo?: VehicleListRecord[]
  removeVehicle: (vehicleId: string) => void
}

export const PartyVehicles: React.FunctionComponent<Props> = ({
  vehicles,
  vehiclesInfo,
  removeVehicle,
}) => (
  <>
    <Box sx={{ width: 1, mb: 2 }}>
      <Typography variant={'h6'}>Vehicule</Typography>
    </Box>
    {!!vehicles.length ? (
      vehicles.map(({ _id }) => {
        const vehicleInfo = vehiclesInfo?.find(
          ({ _id: vehicleId }) => vehicleId === _id,
        )
        return vehicleInfo ? (
          <Box sx={{ width: 1 }}>
            <PartyVehicle
              vehicleInfo={vehicleInfo}
              removeVehicle={removeVehicle}
            />
          </Box>
        ) : null
      })
    ) : (
      <Box sx={{ width: 1 }}>
        <Typography variant={'caption'} textAlign={'center'}>
          Nu exista vehicule.
        </Typography>
      </Box>
    )}
  </>
)
