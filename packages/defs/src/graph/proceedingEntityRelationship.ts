import { z } from 'zod'
import { proceedingEntityInvolvedSchema } from '../proceeding'
import { nodesRelationshipSchema } from './graphBaseRelationship'

export const graphProceedingEntitySchema = z
  .object({
    involvedAs: proceedingEntityInvolvedSchema.shape.involvedAs,
  })
  .merge(nodesRelationshipSchema)

export type ProceedingEntityRelationship = z.infer<typeof graphProceedingEntitySchema>
