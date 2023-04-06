import { z } from 'zod'
import { associateSchema } from '../company'
import { nodesRelationshipSchema } from './graphRelationships'

export const graphCompanyAssociateSchema = z
  .object({
    role: associateSchema.shape.role.shape.value,
    equity: associateSchema.shape.equity.shape.value,
  })
  .merge(nodesRelationshipSchema)

export type CompanyAssociateRelationship = z.infer<typeof graphCompanyAssociateSchema>
