import React from 'react'
import Grid from '@mui/material/Grid'
import { InputNumberFieldWithMetadata } from '@frontend/components/form/inputNumberField/inputNumberFieldWithMetadata'
import { ToggleButtonWithMetadata } from '@frontend/components/form/toggleButton/toggleButtonWithMetadata'
import { Location } from '@frontend/components/form/location'
import { usePropertyState } from '../../../../state/property/propertyState'

export const RealEstateInfo: React.FunctionComponent = () => {
  const [
    realEstateInfo,
    updateRealEstateSurface,
    updateRealEstateTownArea,
    updateRealEstateLocation,
  ] = usePropertyState(
    ({
      realEstateInfo,
      updateRealEstateSurface,
      updateRealEstateTownArea,
      updateRealEstateLocation,
    }) => [
      realEstateInfo,
      updateRealEstateSurface,
      updateRealEstateTownArea,
      updateRealEstateLocation,
    ],
  )

  if (!realEstateInfo) {
    return null
  }

  const { surface, townArea, location } = realEstateInfo

  return (
    <>
      <Grid item xs={6}>
        <InputNumberFieldWithMetadata
          name={'surface'}
          label={'Suprafata'}
          fieldInfo={surface}
          updateFieldInfo={updateRealEstateSurface}
        />
      </Grid>

      <Grid item xs={6}>
        <ToggleButtonWithMetadata
          label={'Intravilan'}
          fieldInfo={townArea}
          updateFieldInfo={updateRealEstateTownArea}
        />
      </Grid>

      <Grid item xs={12}>
        <Location label={'Adresa'} location={location} updateLocation={updateRealEstateLocation} />
      </Grid>
    </>
  )
}
