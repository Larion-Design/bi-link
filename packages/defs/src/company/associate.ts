import { z } from 'zod'
import { dateSchema } from '../date'
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
import { nodesRelationshipSchema } from '../graphRelationships'
import { companySchema } from './company'

export const associateSchema = z
  .object({
    role: textWithMetadataSchema,
    startDate: optionalDateWithMetadataSchema,
    endDate: optionalDateWithMetadataSchema,
    isActive: booleanWithMetadataSchema,
    customFields: z.array(customFieldSchema),
    person: personSchema.nullish(),
    company: companySchema.nullish(),
    equity: numberWithMetadataSchema,
  })
  .merge(withMetadataSchema)

export const associateAPISchema = associateSchema.merge(
  z.object({
    person: connectedEntitySchema.nullish(),
    company: connectedEntitySchema.nullish(),
  }),
)

export const graphCompanyAssociateSchema = nodesRelationshipSchema.merge(
  associateSchema.pick({ role: true, equity: true }),
)

export type Associate = z.infer<typeof associateSchema>
export type AssociateAPI = z.infer<typeof associateAPISchema>

export type CompanyAssociateRelationship = z.infer<typeof graphCompanyAssociateSchema>
