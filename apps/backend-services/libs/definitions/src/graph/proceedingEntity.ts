import { z } from 'zod'
import { nodesRelationshipSchema } from 'defs'

export const proceedingEntityRelationshipSchema = z
  .object({
    involvedAs: z.string(),
  })
  .merge(nodesRelationshipSchema)

export type ProceedingEntityRelationship = z.infer<typeof proceedingEntityRelationshipSchema>
