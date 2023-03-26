import { z } from 'zod'
import { companySchema } from '../company'
import { connectedEntitySchema } from '../connectedEntity'
import { nodesRelationshipSchema } from '../graphRelationships'
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

export const graphProceedingEntitySchema = nodesRelationshipSchema.merge(
  z.object({
    involvedAs: z.string(),
  }),
)

export type ProceedingEntityInvolved = z.infer<typeof proceedingEntityInvolvedSchema>
export type ProceedingEntityInvolvedAPI = z.infer<typeof proceedingEntityInvolvedAPISchema>
export type ProceedingEntityRelationship = z.infer<typeof graphProceedingEntitySchema>
