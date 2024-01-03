import { z } from 'zod'
import { proceedingEntityInvolvedSchema, graphRelationshipMetadataSchema } from 'defs'

export const proceedingEntityRelationshipSchema = proceedingEntityInvolvedSchema
  .pick({ involvedAs: true })
  .merge(graphRelationshipMetadataSchema)

export type ProceedingEntityRelationship = z.infer<typeof proceedingEntityRelationshipSchema>
