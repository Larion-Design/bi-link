import { z } from 'zod'
import { coordinatesSchema, locationSchema } from 'defs'

export const coordinatesIndexSchema = coordinatesSchema.pick({ lat: true }).merge(
  z.object({
    lon: coordinatesSchema.shape.long,
  }),
)

export const locationIndexSchema = locationSchema
  .pick({
    street: true,
    number: true,
    door: true,
    building: true,
    zipCode: true,
    locality: true,
    county: true,
    country: true,
    otherInfo: true,
  })
  .merge(
    z.object({
      coordinates: z.tuple([z.number().default(0), z.number().default(0)]),
    }),
  )

export type CoordinatesIndex = z.infer<typeof coordinatesIndexSchema>
export type LocationIndex = z.infer<typeof locationIndexSchema>
