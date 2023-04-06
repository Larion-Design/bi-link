import { z } from 'zod'
import { relationshipSchema } from '../person'
import { nodesRelationshipSchema } from './graphRelationships'

export const graphPersonalRelationshipInfoSchema = z.object({
  type: relationshipSchema.shape.type,
  proximity: relationshipSchema.shape.type,
})

export const graphPersonalRelationship =
  graphPersonalRelationshipInfoSchema.merge(nodesRelationshipSchema)

export type PersonalRelationship = z.infer<typeof graphPersonalRelationship>
