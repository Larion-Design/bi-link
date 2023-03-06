import { z } from 'zod'

export const coordinatesSchema = z
  .object({
    lat: z.number(),
    long: z.number(),
  })
  .required()

export const locationSchema = z
  .object({
    _id: z.string().optional(),
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
  .required()
  .partial({
    _id: true,
  })

export type Location = z.infer<typeof locationSchema>
export type Coordinates = z.infer<typeof coordinatesSchema>
