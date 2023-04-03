import { z } from 'zod'
import { coordinatesSchema } from 'defs'

export const coordinatesIndexSchema = coordinatesSchema.pick({ lat: true }).merge(
  z.object({
    lon: coordinatesSchema.shape.long,
  }),
)

export const locationIndexSchema = z.object({
  coordinates: coordinatesIndexSchema,
  address: z.string(),
})

export type CoordinatesIndex = z.infer<typeof coordinatesIndexSchema>
export type LocationIndex = z.infer<typeof locationIndexSchema>
