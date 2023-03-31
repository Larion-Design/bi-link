import { z } from 'zod'
import { eventParticipantSchema, graphRelationshipMetadataSchema } from 'defs'

export const eventParticipantGraphSchema = z
  .object({
    type: eventParticipantSchema.shape.type,
  })
  .merge(graphRelationshipMetadataSchema)

export type PartyGraphRelationship = z.infer<typeof eventParticipantGraphSchema>
