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

export const associateSchema = withMetadataSchema.merge(
  z.object({
    role: z.string(),
    startDate: dateSchema.nullable(),
    endDate: dateSchema.nullable(),
    isActive: z.boolean(),
    customFields: z.array(customFieldSchema),
    person: personSchema.nullish(),
    company: companySchema.nullish(),
    equity: z.number(),
  }),
)

export const associateAPISchema = associateSchema.omit({ person: true, company: true }).merge(
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
export type AssociateAPIOutput = AssociateAPI
export type AssociateAPIInput = AssociateAPI

export type CompanyAssociateRelationship = z.infer<typeof graphCompanyAssociateSchema>
