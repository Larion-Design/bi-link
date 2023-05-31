import { z } from 'zod'
import { locationSchema } from '../geolocation'
import { connectedEntitySchema } from '../connectedEntity'
import { personSchema } from '../person'
import { companySchema } from '../company'
import { propertySchema } from '../property'
import { eventSchema } from '../event'
import { proceedingSchema } from '../proceeding'

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
  }),
)

export type DataRef = z.infer<typeof dataRefSchema>
export type DataRefAPI = z.infer<typeof dataRefAPISchema>
