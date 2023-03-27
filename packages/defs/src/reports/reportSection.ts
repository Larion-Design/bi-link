import { z } from 'zod'
import { reportContentAPIOutputSchema, reportContentSchema } from './reportContent'

export const reportSectionSchema = z.object({
  name: z.string(),
  content: reportContentSchema.array(),
})

export const reportSectionAPIOutputSchema = reportSectionSchema.omit({ content: true }).merge(
  z.object({
    content: reportContentAPIOutputSchema.array(),
  }),
)

export type ReportSection = z.infer<typeof reportSectionSchema>
export type ReportSectionAPIInput = ReportSection
export type ReportSectionAPIOutput = z.infer<typeof reportSectionAPIOutputSchema>
