import { z } from 'zod'
import { companySchema } from '../company'
import { connectedEntitySchema } from '../connectedEntity'
import { withMetadataSchema } from '../metadata'
import { personSchema } from '../person'

export const proceedingEntityInvolvedSchema = z
  .object({
    person: personSchema.nullish(),
    company: companySchema.nullish(),
    involvedAs: z.string(),
    description: z.string(),
  })
  .merge(withMetadataSchema)

export const proceedingEntityInvolvedAPISchema = proceedingEntityInvolvedSchema.merge(
  z.object({
    person: connectedEntitySchema.nullish(),
    company: connectedEntitySchema.nullish(),
  }),
)

export type ProceedingEntityInvolved = z.infer<typeof proceedingEntityInvolvedSchema>
export type ProceedingEntityInvolvedAPI = z.infer<typeof proceedingEntityInvolvedAPISchema>
