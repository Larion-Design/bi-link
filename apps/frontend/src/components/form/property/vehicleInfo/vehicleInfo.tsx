import React, { useEffect } from 'react'
import Grid from '@mui/material/Grid'
import { usePropertyState } from '../../../../state/property/propertyState'
import { InputFieldWithMetadata } from '../../inputField'
import { getMakersRequest } from '@frontend/graphql/properties/queries/vehicles/getMakers'
import { getModelsRequest } from '@frontend/graphql/properties/queries/vehicles/getModels'
import { ColorPickerWithMetadata } from '../../colorPicker'
import { AutocompleteFieldWithMetadata } from '@frontend/components/form/autocompleteField/autocompleteFieldWithMetadata'

export const VehicleInfo: React.FunctionComponent = () => {
  const [fetchMakers, { data: makers }] = getMakersRequest()
  const [fetchModels, { data: models }] = getModelsRequest()

  const [vehicleInfo, updateVehicleMaker, updateVehicleModel, updateVin, updateColor] =
    usePropertyState(
      ({ vehicleInfo, updateVehicleMaker, updateVehicleModel, updateVin, updateColor }) => [
        vehicleInfo,
        updateVehicleMaker,
        updateVehicleModel,
        updateVin,
        updateColor,
      ],
    )

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

  if (!vehicleInfo) {
    return null
  }

  const { model, maker, vin, color } = vehicleInfo

  return (
    <>
      <Grid item xs={6}>
        <InputFieldWithMetadata label={'VIN'} fieldInfo={vin} updateFieldInfo={updateVin} />
      </Grid>

      <Grid item xs={6}>
        <AutocompleteFieldWithMetadata
          label={'Marca'}
          fieldInfo={maker}
          updateFieldInfo={updateVehicleMaker}
          suggestions={makers?.getMakers ?? []}
        />
      </Grid>

      <Grid item xs={6}>
        <AutocompleteFieldWithMetadata
          label={'Model'}
          fieldInfo={model}
          updateFieldInfo={updateVehicleModel}
          suggestions={makers?.getMakers ?? []}
        />
      </Grid>

      <Grid item xs={6}>
        <ColorPickerWithMetadata
          label={'Culoare'}
          name={'color'}
          fieldInfo={color}
          updateFieldInfo={updateColor}
        />
      </Grid>
    </>
  )
}
