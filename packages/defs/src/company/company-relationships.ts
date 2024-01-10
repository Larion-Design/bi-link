import { z } from 'zod'
import { connectedEntitySchema } from '../connectedEntity'
import { customFieldSchema } from '../customField'
import { withMetadataSchema } from '../metadata'

const companyRelationshipType = z.enum(['SUPPLIER', 'COMPETITOR', 'DISPUTING'])

export const companyRelationship = z
  .object({
    company: connectedEntitySchema,
    type: z.enum(['SUPPLIER', 'COMPETITOR', 'DISPUTING']),
    customFields: customFieldSchema.array(),
  })
  .merge(withMetadataSchema)

export type CompanyRelationshipType = z.infer<typeof companyRelationshipType>
export type CompanyRelationship = z.infer<typeof companyRelationship>
