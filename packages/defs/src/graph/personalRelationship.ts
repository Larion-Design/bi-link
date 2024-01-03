import { z } from 'zod'
import { relationshipSchema } from '../person'
import { nodesRelationshipSchema } from './graphBaseRelationship'

export const graphPersonalRelationshipInfoSchema = z.object({
  type: relationshipSchema.shape.type,
  proximity: relationshipSchema.shape.proximity,
})

export const graphPersonalRelationship =
  graphPersonalRelationshipInfoSchema.merge(nodesRelationshipSchema)

export type PersonalRelationship = z.infer<typeof graphPersonalRelationship>
