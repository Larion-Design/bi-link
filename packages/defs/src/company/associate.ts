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
import { nodesRelationshipSchema } from '../graphRelationships'

export const associateSchema = z
  .object({
    role: textWithMetadataSchema,
    startDate: optionalDateWithMetadataSchema,
    endDate: optionalDateWithMetadataSchema,
    isActive: booleanWithMetadataSchema,
    customFields: z.array(customFieldSchema),
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

export const graphCompanyAssociateSchema = nodesRelationshipSchema.merge(
  z.object({
    role: associateSchema.shape.role.shape.value,
    equity: associateSchema.shape.equity.shape.value,
  }),
)

export type Associate = z.infer<typeof associateSchema>
export type AssociateAPI = z.infer<typeof associateAPISchema>

export type CompanyAssociateRelationship = z.infer<typeof graphCompanyAssociateSchema>
