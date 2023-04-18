import Box from '@mui/material/Box'
import React from 'react'
import { useIntl } from 'react-intl'
import { LocationAPIInput } from 'defs'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { TitleWithMetadata } from '@frontend/components/form/titleWithMetadata'

import { InputField } from '../inputField'

type Props<T = LocationAPIInput> = {
  label: string
  location: T | null
  updateLocation: (location: T | null) => void | Promise<void>
  includeFields?: Array<keyof Omit<T, 'locationId' | 'metadata'>>
}

export const Location: React.FunctionComponent<Props> = ({
  label,
  location,
  updateLocation,
  includeFields,
}) => {
  const { formatMessage } = useIntl()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {location ? (
          <TitleWithMetadata
            variant={'h6'}
            label={label}
            metadata={location.metadata}
            updateMetadata={(metadata) => updateLocation({ ...location, metadata })}
          />
        ) : (
          <Typography variant={'h6'} gutterBottom>
            {label}
          </Typography>
        )}
      </Grid>

      <Grid container item xs={12} spacing={4}>
        {locationFields
          .filter(({ field }) => !includeFields || includeFields.includes(field))
          .map(({ gridSize, field }) => (
            <Grid key={field} item xs={gridSize}>
              <InputField
                label={formatMessage({ id: field, defaultMessage: field })}
                value={location?.[field] ?? ''}
                onChange={(value) => updateLocation({ ...location, [field]: value })}
              />
            </Grid>
          ))}
      </Grid>
    </Grid>
  )
}

type LocationFieldParams = {
  gridSize: number
  field: keyof Omit<LocationAPIInput, '_id' | 'coordinates' | 'locationId' | 'metadata'>
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
