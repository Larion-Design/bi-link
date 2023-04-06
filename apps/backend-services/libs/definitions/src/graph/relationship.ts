import { z } from 'zod'
import { relationshipSchema, graphRelationshipMetadataSchema } from 'defs'

export const personalRelationshipSchema = relationshipSchema
  .pick({ type: true, proximity: true })
  .merge(graphRelationshipMetadataSchema)

export type PersonalRelationshipGraph = z.infer<typeof personalRelationshipSchema>
