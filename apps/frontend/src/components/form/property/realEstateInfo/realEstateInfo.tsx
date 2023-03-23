import React, { useCallback, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { InputNumberField } from '@frontend/components/form/inputNumberField'
import { Location } from '@frontend/components/form/location'
import { ToggleButton } from '@frontend/components/form/toggleButton'
import { LocationAPIInput, RealEstateAPIInput } from 'defs'
import { useDebounce } from 'usehooks-ts'

type Props = {
  realEstateInfo: RealEstateAPIInput
  updateRealEstateInfo: (realEstateInfo: RealEstateAPIInput) => void | Promise<void>
}

export const RealEstateInfo: React.FunctionComponent<Props> = ({
  realEstateInfo,
  updateRealEstateInfo,
}) => {
  const [realEstate, setRealEstate] = useState(realEstateInfo)
  const debouncedRealEstate = useDebounce(realEstate, 1000)

  const updateSurface = useCallback(
    (surface: number) => setRealEstate((realEstate) => ({ ...realEstate, surface })),
    [realEstate.surface],
  )

  const updateTownArea = useCallback(
    (townArea: boolean) => setRealEstate((realEstate) => ({ ...realEstate, townArea })),
    [realEstate.townArea],
  )

  const updateLocation = useCallback(
    (location: LocationAPIInput | null) =>
      setRealEstate((realEstate) => ({ ...realEstate, location })),
    [realEstate.location],
  )

  useEffect(() => {
    updateRealEstateInfo(debouncedRealEstate)
  }, [debouncedRealEstate])

  return (
    <>
      <Grid item xs={6}>
        <InputNumberField
          name={'surface'}
          label={'Suprafata'}
          value={realEstate.surface}
          onChange={updateSurface}
        />
      </Grid>

      <Grid item xs={6}>
        <ToggleButton
          label={'Intravilan'}
          checked={realEstate.townArea}
          onChange={updateTownArea}
        />
      </Grid>

      <Grid item xs={12}>
        <Location label={'Adresa'} location={realEstate.location} updateLocation={updateLocation} />
      </Grid>
    </>
  )
}
