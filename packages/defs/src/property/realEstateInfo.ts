import { z } from 'zod'
import { booleanWithMetadataSchema, numberWithMetadataSchema } from '../generic'
import { locationSchema } from '../geolocation'

export const realEstateSchema = z.object({
  surface: numberWithMetadataSchema,
  townArea: booleanWithMetadataSchema,
  location: locationSchema.nullable(),
})

export type RealEstateInfo = z.infer<typeof realEstateSchema>
