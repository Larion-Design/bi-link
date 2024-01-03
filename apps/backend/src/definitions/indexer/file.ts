import { z } from 'zod'
import { fileSchema } from 'defs'

export const processedFileIndexSchema = z.object({
  content: z.string(),
  processedDate: z.string(),
})

export const embeddedFileIndexSchema = fileSchema.pick({ name: true, description: true }).merge(
  z.object({
    content: z.string(),
  }),
)

export type ProcessedFileIndex = z.infer<typeof processedFileIndexSchema>
export type EmbeddedFileIndex = z.infer<typeof embeddedFileIndexSchema>
