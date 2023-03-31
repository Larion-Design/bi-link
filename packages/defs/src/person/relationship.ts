import { z } from 'zod'
import { withMetadataSchema } from '../metadata'
import { connectedEntitySchema } from '../connectedEntity'
import { nodesRelationshipSchema } from '../graphRelationships'

export const relationshipSchema = z
  .object({
    type: z.string(),
    proximity: z.number(),
    description: z.string(),
    relatedPersons: connectedEntitySchema.array(),
    person: connectedEntitySchema,
  })
  .merge(withMetadataSchema)

export const graphPersonalRelationship = nodesRelationshipSchema.merge(
  z.object({
    type: relationshipSchema.shape.type,
  }),
)

export type Relationship = z.infer<typeof relationshipSchema>
export type RelationshipAPI = Relationship
export type PersonalRelationship = z.infer<typeof graphPersonalRelationship>
