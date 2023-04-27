import { z } from 'zod'
import {
  booleanWithMetadataSchema,
  numberWithMetadataSchema,
  optionalDateWithMetadataSchema,
  textWithMetadataSchema,
} from '../generic'
import { withMetadataSchema } from '../metadata'
import { customFieldSchema } from '../customField'
import { personSchema } from '../person'
import { connectedEntitySchema } from '../connectedEntity'

export const associateSchema = z
  .object({
    role: textWithMetadataSchema,
    startDate: optionalDateWithMetadataSchema,
    endDate: optionalDateWithMetadataSchema,
    isActive: booleanWithMetadataSchema,
    customFields: customFieldSchema.array(),
    person: personSchema.nullish(),
    company: connectedEntitySchema.nullish(),
    equity: numberWithMetadataSchema,
  })
  .merge(withMetadataSchema)

export const associateAPISchema = associateSchema.merge(
  z.object({
    person: connectedEntitySchema.nullish(),
    company: connectedEntitySchema.nullish(),
  }),
)

export type Associate = z.infer<typeof associateSchema>
export type AssociateAPI = z.infer<typeof associateAPISchema>
