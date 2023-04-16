import React, { useEffect } from 'react'
import { VehicleInfo as VehicleInfoType } from 'defs'
import Grid from '@mui/material/Grid'
import { InputField } from '../../inputField'
import { AutocompleteField } from '../../autocompleteField'
import { getMakersRequest } from '@frontend/graphql/properties/queries/vehicles/getMakers'
import { getModelsRequest } from '@frontend/graphql/properties/queries/vehicles/getModels'
import { ColorPicker } from '../../colorPicker'

type Props<T = VehicleInfoType> = {
  vehicleInfo: T
  updateVehicleInfo: (vehicleInfo: T) => void | Promise<void>
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
    if (vehicleInfo && !makers && !models) {
      void fetchMakers()
      void fetchModels()
    }
  }, [vehicleInfo])

  useEffect(() => {
    const maker = vehicleInfo?.maker.value
    if (maker?.length) {
      void fetchModels({ variables: { maker } })
    }
  }, [vehicleInfo?.maker.value])

  useEffect(() => {
    const model = vehicleInfo?.model.value
    if (model?.length) {
      void fetchMakers({ variables: { model } })
    }
  }, [vehicleInfo?.model.value])

  return (
    <>
      <Grid item xs={6}>
        <InputField
          name={'vin'}
          label={'VIN'}
          value={vehicleInfo?.vin.value}
          error={error}
          onChange={(value) =>
            updateVehicleInfo({
              ...vehicleInfo,
              vin: { metadata: vehicleInfo.vin.metadata, value },
            })
          }
        />
      </Grid>
      <Grid item xs={6}>
        <AutocompleteField
          label={'Marca'}
          value={vehicleInfo.maker.value}
          error={error}
          suggestions={makers?.getMakers ?? []}
          onValueChange={async (value) =>
            updateVehicleInfo({
              ...vehicleInfo,
              maker: { value, metadata: vehicleInfo.maker.metadata },
            })
          }
        />
      </Grid>
      <Grid item xs={6}>
        <AutocompleteField
          label={'Model'}
          value={vehicleInfo.model.value}
          error={error}
          suggestions={models?.getModels ?? []}
          onValueChange={async (value) =>
            updateVehicleInfo({
              ...vehicleInfo,
              model: { value, metadata: vehicleInfo.model.metadata },
            })
          }
        />
      </Grid>
      <Grid item xs={6}>
        <ColorPicker
          name={'color'}
          value={vehicleInfo?.color.value}
          label={'Culoare'}
          error={error}
          onChange={async (value) =>
            updateVehicleInfo({
              ...vehicleInfo,
              color: { value, metadata: vehicleInfo.color.metadata },
            })
          }
        />
      </Grid>
    </>
  )
}
