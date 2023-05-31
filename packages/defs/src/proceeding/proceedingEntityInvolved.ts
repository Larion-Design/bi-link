import { z } from 'zod'
import { connectedEntitySchema } from '../connectedEntity'
import { withMetadataSchema } from '../metadata'

export const proceedingEntityInvolvedSchema = z
  .object({
    person: connectedEntitySchema.nullish(),
    company: connectedEntitySchema.nullish(),
    involvedAs: z.string(),
    description: z.string(),
  })
  .merge(withMetadataSchema)

export type ProceedingEntityInvolved = z.infer<typeof proceedingEntityInvolvedSchema>
export type ProceedingEntityInvolvedAPI = ProceedingEntityInvolved
