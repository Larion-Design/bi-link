import React, { useEffect } from 'react'
import { VehicleInfo as VehicleInfoType } from 'defs'
import Grid from '@mui/material/Grid'
import { InputField } from '../../inputField'
import { AutocompleteField } from '../../autocompleteField'
import { getMakersRequest } from '@frontend/graphql/properties/queries/vehicles/getMakers'
import { getModelsRequest } from '@frontend/graphql/properties/queries/vehicles/getModels'
import { ColorPicker } from '../../colorPicker'

type Props = {
  vehicleInfo: VehicleInfoType
  updateVehicleInfo: (vehicleInfo: VehicleInfoType) => void | Promise<void>
  error?: string
}

export const VehicleInfo: React.FunctionComponent<Props> = ({
  vehicleInfo,
  updateVehicleInfo,
  error,
}) => {
  const [fetchMakers, { data: makers }] = getMakersRequest()
  const [fetchModels, { data: models }] = getModelsRequest()

  useEffect(() => {
    void fetchMakers()
    void fetchModels()
  }, [])

  useEffect(() => {
    if (vehicleInfo && !makers && !models) {
      void fetchMakers()
      void fetchModels()
    }
  }, [vehicleInfo])

  useEffect(() => {
    if (vehicleInfo?.maker.length) {
      void fetchModels({ variables: { maker: vehicleInfo.maker } })
    }
  }, [vehicleInfo?.maker])

  useEffect(() => {
    if (vehicleInfo?.model.length) {
      void fetchMakers({ variables: { model: vehicleInfo.model } })
    }
  }, [vehicleInfo?.model])

  return (
    <>
      <Grid item xs={6}>
        <InputField
          name={'vin'}
          label={'VIN'}
          value={vehicleInfo?.vin}
          error={error}
          onChange={(vin) => updateVehicleInfo({ ...vehicleInfo, vin })}
        />
      </Grid>
      <Grid item xs={6}>
        <AutocompleteField
          label={'Marca'}
          value={vehicleInfo.maker}
          error={error}
          suggestions={makers?.getMakers ?? []}
          onValueChange={async (maker) => updateVehicleInfo({ ...vehicleInfo, maker })}
        />
      </Grid>
      <Grid item xs={6}>
        <AutocompleteField
          label={'Model'}
          value={vehicleInfo.model}
          error={error}
          suggestions={models?.getModels ?? []}
          onValueChange={async (model) => updateVehicleInfo({ ...vehicleInfo, model })}
        />
      </Grid>
      <Grid item xs={6}>
        <ColorPicker
          name={'color'}
          value={vehicleInfo?.color}
          label={'Culoare'}
          error={error}
          onChange={async (color) => updateVehicleInfo({ ...vehicleInfo, color })}
        />
      </Grid>
    </>
  )
}
