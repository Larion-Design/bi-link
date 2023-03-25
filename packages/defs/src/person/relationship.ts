import { z } from 'zod'
import { withMetadataSchema } from '../metadata'
import { connectedEntitySchema } from '../connectedEntity'
import { nodesRelationshipSchema } from '../graphRelationships'
import { personSchema } from './person'

export const relationshipSchema = withMetadataSchema.merge(
  z.object({
    type: z.string(),
    proximity: z.number(),
    person: personSchema,
    description: z.string(),
    relatedPersons: z.array(personSchema),
  }),
)

export const relationshipAPISchema = relationshipSchema
  .omit({ person: true, relatedPersons: true })
  .merge(
    z.object({
      person: connectedEntitySchema,
      relatedPersons: z.array(connectedEntitySchema),
    }),
  )

export const graphPersonalRelationship = nodesRelationshipSchema.merge(
  z.object({
    type: z.string(),
  }),
)

export type Relationship = z.infer<typeof relationshipSchema>
export type RelationshipAPI = z.infer<typeof relationshipAPISchema>
export type RelationshipAPIOutput = RelationshipAPI
export type RelationshipAPIInput = RelationshipAPI

export type PersonalRelationship = z.infer<typeof graphPersonalRelationship>
