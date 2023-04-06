import { z } from 'zod'
import { graphPersonalRelationshipInfoSchema, graphRelationshipMetadataSchema } from 'defs'

export const personalRelationshipSchema = graphPersonalRelationshipInfoSchema.merge(
  graphRelationshipMetadataSchema,
)

export type PersonalRelationshipGraph = z.infer<typeof personalRelationshipSchema>
