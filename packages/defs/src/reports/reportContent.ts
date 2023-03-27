import { z } from 'zod'
import { reportGraphSchema } from './reportGraph'
import { titleSchema } from './title'
import { tableSchema } from './table'
import { linkSchema } from './link'
import { reportTextSchema } from './text'
import { fileOutputSchema, fileSchema } from '../file'

export const reportContentSchema = z.object({
  order: z.number().positive(),
  isActive: z.boolean().default(true),
  title: titleSchema.nullish(),
  text: reportTextSchema.nullish(),
  images: fileSchema.array().nullish(),
  file: fileSchema.nullish(),
  table: tableSchema.nullish(),
  link: linkSchema.nullish(),
  graph: reportGraphSchema.nullish(),
})

export const reportContentAPIOutputSchema = reportContentSchema.merge(
  z.object({
    file: fileOutputSchema.nullish(),
    images: fileOutputSchema.array().nullish(),
  }),
)

export type ReportContent = z.infer<typeof reportContentSchema>
export type ReportContentAPIInput = ReportContent
export type ReportContentAPIOutput = z.infer<typeof reportContentAPIOutputSchema>
