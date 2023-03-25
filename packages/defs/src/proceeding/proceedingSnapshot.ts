import { z } from 'zod'
import { withSnapshotSchema } from '../snapshot'
import { proceedingSchema } from './proceeding'

export const proceedingSnapshotSchema = withSnapshotSchema.merge(
  z.object({
    entityInfo: proceedingSchema.omit({ _id: true }),
  }),
)

export type ProceedingSnapshot = z.infer<typeof proceedingSnapshotSchema>
