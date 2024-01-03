import { z } from 'zod'
import { companyAPIOutputSchema } from '../company'
import { eventAPIOutputSchema } from '../event'
import { locationSchema } from '../geolocation'
import { personAPIOutputSchema } from '../person'
import { proceedingAPIOutputSchema } from '../proceeding'
import { propertyAPIOutputSchema } from '../property'
import { reportAPIOutputSchema } from '../reports'

export const graphEntitiesSchema = z.object({
  companies: companyAPIOutputSchema.array(),
  persons: personAPIOutputSchema.array(),
  properties: propertyAPIOutputSchema.array(),
  events: eventAPIOutputSchema.array(),
  locations: locationSchema.array(),
  proceedings: proceedingAPIOutputSchema.array(),
  reports: reportAPIOutputSchema.array(),
})

export const nodeMetadataSchema = z.object({
  _id: z.string(),
})

export type EntityMetadata = z.infer<typeof nodeMetadataSchema>
export type GraphEntities = z.infer<typeof graphEntitiesSchema>
