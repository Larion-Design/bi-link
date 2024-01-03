import { z } from 'zod'
import { numberWithDefaultZero } from '../helperTypes'
import { baseField, fieldType } from './base'

export const geoCoordinatesField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.geoCoordinates),
    value: z.tuple([numberWithDefaultZero, numberWithDefaultZero]),
  }),
)

export type GeoCoordinatesField = z.infer<typeof geoCoordinatesField>
