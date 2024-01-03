import { z } from 'zod'
import { withSnapshotSchema } from '../snapshot'
import { personSchema } from './person'

export const personSnapshotSchema = withSnapshotSchema.merge(
  z.object({
    entityInfo: personSchema.omit({ _id: true }),
  }),
)

export type PersonSnapshot = z.infer<typeof personSnapshotSchema>
