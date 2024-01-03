import { z } from 'zod'
import { withMetadataSchema } from './metadata'

export const coordinatesSchema = z.object({
  lat: z.number(),
  long: z.number(),
})

export const locationSchema = z
  .object({
    locationId: z.string(),
    street: z.string(),
    number: z.string(),
    building: z.string(),
    door: z.string(),
    zipCode: z.string(),
    locality: z.string(),
    county: z.string(),
    country: z.string(),
    otherInfo: z.string(),
    coordinates: coordinatesSchema,
  })
  .merge(withMetadataSchema)

export type Coordinates = z.infer<typeof coordinatesSchema>
export type CoordinatesAPI = Coordinates

export type Location = z.infer<typeof locationSchema>
export type LocationAPIInput = Location
export type LocationAPIOutput = Location
