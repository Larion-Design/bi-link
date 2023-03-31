import { z } from 'zod'
import { relationshipSchema, nodesRelationshipSchema } from 'defs'

export const personalRelationshipSchema = relationshipSchema
  .pick({ type: true, proximity: true })
  .merge(nodesRelationshipSchema)

export type PersonalRelationshipGraph = z.infer<typeof personalRelationshipSchema>
