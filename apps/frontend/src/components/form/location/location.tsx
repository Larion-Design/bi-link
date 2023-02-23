import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import React, { useCallback, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useDebounce } from 'usehooks-ts'
import { LocationAPIInput } from 'defs'
import { InputField } from '../inputField'

type Props = {
  label: string
  location: LocationAPIInput
  updateLocation: (location: LocationAPIInput) => void | Promise<void>
  includeFields?: Array<keyof Omit<LocationAPIInput, 'locationId'>>
}

export const Location: React.FunctionComponent<Props> = ({
  label,
  location,
  updateLocation,
  includeFields,
}) => {
  const intl = useIntl()
  const [locationInfo, setLocationInfo] = useState(location)
  const debouncedLocationInfo = useDebounce(locationInfo, 1000)

  const updateLocationInfo = useCallback(
    (fieldName: keyof LocationAPIInput, value: string) =>
      setLocationInfo((locationInfo) => ({ ...locationInfo, [fieldName]: value })),
    [setLocationInfo],
  )

  useEffect(() => {
    void updateLocation(debouncedLocationInfo)
  }, [debouncedLocationInfo])

  return (
    <Box>
      <Typography variant={'h5'} gutterBottom>
        {label}
      </Typography>
      <Grid container spacing={4}>
        {locationFields
          .filter(({ field }) => !includeFields || includeFields.includes(field))
          .map(({ gridSize, field }) => (
            <Grid item xs={gridSize}>
              <InputField
                label={intl.formatMessage({ id: field })}
                value={locationInfo[field]}
                onChange={(value) => updateLocationInfo(field, value)}
              />
            </Grid>
          ))}
      </Grid>
    </Box>
  )
}

type LocationFieldParams = {
  gridSize: number
  field: keyof Omit<LocationAPIInput, 'coordinates' | 'locationId'>
}

const locationFields: LocationFieldParams[] = [
  { gridSize: 4, field: 'street' },
  { gridSize: 1, field: 'number' },
  { gridSize: 1, field: 'building' },
  { gridSize: 1, field: 'door' },
  { gridSize: 4, field: 'locality' },
  { gridSize: 4, field: 'county' },
  { gridSize: 4, field: 'country' },
  { gridSize: 1, field: 'zipCode' },
  { gridSize: 8, field: 'otherInfo' },
]
