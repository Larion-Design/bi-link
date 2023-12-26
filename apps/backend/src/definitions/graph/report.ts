import { z } from 'zod'
import { nodeMetadataSchema, reportSchema } from 'defs'

export const reportGraphSchema = reportSchema
  .pick({ _id: true, name: true, type: true })
  .merge(nodeMetadataSchema)

export type ReportGraphNode = z.infer<typeof reportGraphSchema>
