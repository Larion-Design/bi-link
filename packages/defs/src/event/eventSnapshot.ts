import { z } from 'zod'
import { withSnapshotSchema } from '../snapshot'
import { eventSchema } from './event'

export const eventSnapshotSchema = withSnapshotSchema.merge(
  z.object({
    entityInfo: eventSchema.omit({ _id: true }),
  }),
)

export type EventSnapshot = z.infer<typeof eventSnapshotSchema>
