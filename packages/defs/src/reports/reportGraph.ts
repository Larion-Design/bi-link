import { z } from 'zod'

export const reportGraphSchema = z.object({
  label: z.string(),
})

export type ReportGraph = z.infer<typeof reportGraphSchema>
export type GraphAPI = ReportGraph
