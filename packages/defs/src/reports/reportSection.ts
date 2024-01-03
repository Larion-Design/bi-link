import { z } from 'zod'
import {
  reportContentAPIInputSchema,
  reportContentAPIOutputSchema,
  reportContentSchema,
} from './reportContent'

export const reportSectionSchema = z.object({
  name: z.string(),
  content: reportContentSchema.array(),
})

export const reportSectionAPIInputSchema = reportSectionSchema.merge(
  z.object({
    content: reportContentAPIInputSchema.array(),
  }),
)

export const reportSectionAPIOutputSchema = reportSectionSchema.merge(
  z.object({
    content: reportContentAPIOutputSchema.array(),
  }),
)

export type ReportSection = z.infer<typeof reportSectionSchema>
export type ReportSectionAPIInput = z.infer<typeof reportSectionAPIInputSchema>
export type ReportSectionAPIOutput = z.infer<typeof reportSectionAPIOutputSchema>
