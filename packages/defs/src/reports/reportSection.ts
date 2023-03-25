import { z } from 'zod'
import { reportContentAPIOutputSchema, reportContentSchema } from './reportContent'

export const reportSectionSchema = z.object({
  name: z.string(),
  content: z.array(reportContentSchema),
})

export const reportSectionAPIOutputSchema = reportSectionSchema.omit({ content: true }).merge(
  z.object({
    content: z.array(reportContentAPIOutputSchema),
  }),
)

export type ReportSection = z.infer<typeof reportSectionSchema>
export type ReportSectionAPIInput = ReportSection
export type ReportSectionAPIOutput = z.infer<typeof reportSectionAPIOutputSchema>
