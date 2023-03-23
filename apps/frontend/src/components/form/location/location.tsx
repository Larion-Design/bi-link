import React, { useCallback, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useIntl } from 'react-intl'
import { useDebounce } from 'usehooks-ts'
import { LocationAPIInput } from 'defs'
import { InputField } from '../inputField'

type Props = {
  label: string
  location: LocationAPIInput | null
  updateLocation: (location: LocationAPIInput | null) => void | Promise<void>
  includeFields?: Array<keyof Omit<LocationAPIInput, 'locationId'>>
}

export const Location: React.FunctionComponent<Props> = ({
  label,
  location,
  updateLocation,
  includeFields,
}) => {
  const { formatMessage } = useIntl()
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
      <Typography variant={'h6'} sx={{ mb: 3 }}>
        {label}
      </Typography>
      <Grid container spacing={4}>
        {locationFields
          .filter(({ field }) => !includeFields || includeFields.includes(field))
          .map(({ gridSize, field }) => (
            <Grid key={field} item xs={gridSize}>
              <InputField
                label={formatMessage({ id: field, defaultMessage: field })}
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
  field: keyof Omit<LocationAPIInput, '_id' | 'coordinates' | 'locationId'>
}

const locationFields: LocationFieldParams[] = [
  { gridSize: 5, field: 'street' },
  { gridSize: 2, field: 'number' },
  { gridSize: 2, field: 'building' },
  { gridSize: 3, field: 'door' },
  { gridSize: 5, field: 'locality' },
  { gridSize: 4, field: 'county' },
  { gridSize: 3, field: 'zipCode' },
  { gridSize: 5, field: 'country' },
  { gridSize: 7, field: 'otherInfo' },
]
