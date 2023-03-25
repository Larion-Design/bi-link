import { z } from 'zod'
import { withSnapshotSchema } from '../snapshot'
import { propertySchema } from './property'

export const propertySnapshotSchema = withSnapshotSchema.merge(
  z.object({
    entityInfo: propertySchema.omit({ _id: true }),
  }),
)

export type PropertySnapshot = z.infer<typeof propertySnapshotSchema>
