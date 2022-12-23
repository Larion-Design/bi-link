import React from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { PersonCardActions } from '../../card/personCardActions'
import { VehicleListRecord } from '../../../types/vehicle'

type Props = {
  vehicleInfo: VehicleListRecord
  removeVehicle: (vehicleId: string) => void
}

export const PartyVehicle: React.FunctionComponent<Props> = ({
  vehicleInfo: { _id, vin, maker, model },
  removeVehicle,
}) => (
  <Card variant={'outlined'}>
    <CardContent
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant={'body1'} sx={{ mb: 3, mt: 2 }}>
        {`${maker} ${model}`}
      </Typography>
      <Typography variant={'subtitle1'}>{vin}</Typography>
    </CardContent>
    <PersonCardActions
      name={`${maker} ${model}`}
      personId={_id}
      onRemove={() => removeVehicle(_id)}
    />
  </Card>
)
