import React, { useCallback, useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import { InputNumberField } from '@frontend/components/form/inputNumberField'
import { Location } from '@frontend/components/form/location'
import { ToggleButton } from '@frontend/components/form/toggleButton'
import { LocationAPIInput, RealEstateInfo as RealEstateInfoType } from 'defs'
import { useDebounce } from 'usehooks-ts'

type Props<T = RealEstateInfoType> = {
  realEstateInfo: T
  updateRealEstateInfo: (realEstateInfo: T) => void | Promise<void>
}

export const RealEstateInfo: React.FunctionComponent<Props> = ({
  realEstateInfo,
  updateRealEstateInfo,
}) => {
  const [realEstate, setRealEstate] = useState(realEstateInfo)
  const debouncedRealEstate = useDebounce(realEstate, 1000)

  const updateSurface = useCallback(
    (value: number) =>
      setRealEstate((realEstate) => ({
        ...realEstate,
        surface: { ...realEstate.surface, value },
      })),
    [realEstate.surface],
  )

  const updateTownArea = useCallback(
    (value: boolean) =>
      setRealEstate((realEstate) => ({
        ...realEstate,
        townArea: { ...realEstate.townArea, value },
      })),
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
          value={realEstate.surface.value}
          onChange={updateSurface}
        />
      </Grid>

      <Grid item xs={6}>
        <ToggleButton
          label={'Intravilan'}
          checked={realEstate.townArea.value}
          onChange={updateTownArea}
        />
      </Grid>

      <Grid item xs={12}>
        <Location label={'Adresa'} location={realEstate.location} updateLocation={updateLocation} />
      </Grid>
    </>
  )
}
