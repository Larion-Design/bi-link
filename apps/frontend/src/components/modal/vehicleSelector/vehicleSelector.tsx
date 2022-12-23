import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { SearchVehicles } from './searchVehicles'
import { FastCreateVehicle } from './fastCreateVehicle'

export type VehicleSelectorView = 'search' | 'createVehicle'

type Props = {
  closeModal: () => void
  vehiclesSelected?: (vehiclesIds: string[]) => void
  excludedVehiclesIds?: string[]
}

export const VehicleSelector: React.FunctionComponent<Props> = ({
  closeModal,
  vehiclesSelected,
  excludedVehiclesIds,
}) => {
  const [view, setView] = useState<VehicleSelectorView>('search')

  return (
    <Card sx={{ p: 2, width: '80vw', height: '90vh' }} variant={'elevation'}>
      {view === 'search' && (
        <SearchVehicles
          closeModal={closeModal}
          changeView={setView}
          vehiclesSelected={vehiclesSelected}
          excludedVehiclesIds={excludedVehiclesIds}
        />
      )}
      {view === 'createVehicle' && (
        <FastCreateVehicle
          closeModal={closeModal}
          changeView={setView}
          vehiclesSelected={vehiclesSelected}
        />
      )}
    </Card>
  )
}
