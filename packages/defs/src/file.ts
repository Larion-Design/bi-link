import { z } from 'zod'
import { withMetadataSchema } from './metadata'
import { withTimestamps } from './modelTimestamps'

export const downloadUrlSchema = z.object({
  url: z.string(),
  ttl: z.number(),
})

export const fileSchema = z
  .object({
    fileId: z.string(),
    name: z.string(),
    description: z.string(),
    mimeType: z.string(),
    hash: z.string(),
    isHidden: z.boolean().default(false),
  })
  .merge(withTimestamps)
  .merge(withMetadataSchema)

export const fileInputSchema = fileSchema
  .omit({
    createdAt: true,
    updatedAt: true,
    hash: true,
    mimeType: true,
  })
  .merge(z.object({}))

export const fileOutputSchema = fileSchema.omit({ hash: true }).merge(
  z.object({
    url: downloadUrlSchema.optional(),
  }),
)

export type DownloadUrl = z.infer<typeof downloadUrlSchema>
export type File = z.infer<typeof fileSchema>
export type FileAPIInput = z.infer<typeof fileInputSchema>
export type FileAPIOutput = z.infer<typeof fileOutputSchema>
