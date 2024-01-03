import { z } from 'zod'
import { reportSchema } from './report'
import { withSnapshotSchema } from '../snapshot'

export const reportSnapshotSchema = z
  .object({
    entityInfo: reportSchema.omit({ _id: true }),
  })
  .merge(withSnapshotSchema)

export type ReportSnapshot = z.infer<typeof reportSnapshotSchema>
