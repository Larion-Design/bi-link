import { z } from 'zod'
import { withSnapshotSchema } from '../snapshot'
import { reportSchema } from './report'

export const reportSnapshotSchema = withSnapshotSchema.merge(
  z.object({
    entityInfo: reportSchema.omit({ _id: true }),
  }),
)

export type ReportSnapshot = z.infer<typeof reportSnapshotSchema>
