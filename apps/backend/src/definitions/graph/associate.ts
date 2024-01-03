import { z } from 'zod'
import { associateSchema, graphRelationshipMetadataSchema } from 'defs'

export const associateGraphSchema = z
  .object({
    role: associateSchema.shape.role.shape.value,
    startDate: associateSchema.shape.startDate.shape.value,
    endDate: associateSchema.shape.endDate.shape.value,
    isActive: associateSchema.shape.isActive.shape.value,
    equity: associateSchema.shape.equity.shape.value,
  })
  .merge(graphRelationshipMetadataSchema)

export type AssociateGraphRelationship = z.infer<typeof associateGraphSchema>
