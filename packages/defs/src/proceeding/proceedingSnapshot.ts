import { z } from 'zod'
import { withSnapshotSchema } from '../snapshot'
import { proceedingAPIInputSchema } from './proceeding'

export const proceedingSnapshotSchema = withSnapshotSchema.merge(
  z.object({
    entityInfo: proceedingAPIInputSchema,
  }),
)

export type ProceedingSnapshot = z.infer<typeof proceedingSnapshotSchema>
