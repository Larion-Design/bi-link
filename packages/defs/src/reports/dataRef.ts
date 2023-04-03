import { z } from 'zod'
import {
  companySchema,
  connectedEntitySchema,
  eventSchema,
  locationSchema,
  personSchema,
  proceedingSchema,
  propertySchema,
} from '../index'

export const dataRefSchema = z.object({
  _id: z.string(),
  person: personSchema.nullish(),
  company: companySchema.nullish(),
  property: propertySchema.nullish(),
  event: eventSchema.nullish(),
  proceeding: proceedingSchema.nullish(),
  location: locationSchema.nullish(),
  path: z.string().nullish(),
  targetId: z.string().nullish(),
  field: z.string(),
})

export const dataRefAPISchema = dataRefSchema.merge(
  z.object({
    person: connectedEntitySchema.nullish(),
    company: connectedEntitySchema.nullish(),
    property: connectedEntitySchema.nullish(),
    proceeding: connectedEntitySchema.nullish(),
    event: connectedEntitySchema.nullish(),
    location: connectedEntitySchema.nullish(),
  }),
)

export type DataRef = z.infer<typeof dataRefSchema>
export type DataRefAPI = z.infer<typeof dataRefAPISchema>
