import { z } from 'zod'
import { eventSchema } from '../event'
import { nodesRelationshipSchema } from './graphBaseRelationship'

export const graphEventParticipantSchema = z
  .object({
    type: eventSchema.shape.type.shape.value,
  })
  .merge(nodesRelationshipSchema)

export type EventParticipantRelationship = z.infer<typeof graphEventParticipantSchema>
