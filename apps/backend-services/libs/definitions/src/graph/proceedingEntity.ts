import { z } from 'zod'
import { proceedingEntityInvolvedSchema, nodesRelationshipSchema } from 'defs'

export const proceedingEntityRelationshipSchema = proceedingEntityInvolvedSchema
  .pick({ involvedAs: true })
  .merge(nodesRelationshipSchema)

export type ProceedingEntityRelationship = z.infer<typeof proceedingEntityRelationshipSchema>
