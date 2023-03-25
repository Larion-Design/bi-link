import { z } from 'zod'
import { companySchema } from '../company'
import { connectedEntitySchema } from '../connectedEntity'
import { textWithMetadataSchema } from '../generic'
import { NodesRelationship, nodesRelationshipSchema } from '../graphRelationships'
import { withMetadataSchema } from '../metadata'
import { personSchema } from '../person'

export const proceedingEntityInvolvedSchema = withMetadataSchema.merge(
  z.object({
    person: personSchema.nullish(),
    company: companySchema.nullish(),
    involvedAs: textWithMetadataSchema,
    description: z.string(),
  }),
)

export const proceedingEntityInvolvedAPISchema = proceedingEntityInvolvedSchema
  .omit({ person: true, company: true })
  .merge(
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
