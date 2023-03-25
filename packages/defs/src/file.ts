import { z } from 'zod'
import { withMetadataSchema } from './metadata'

export const downloadUrlSchema = z.object({
  url: z.string(),
  ttl: z.number(),
})

export const fileSchema = withMetadataSchema.merge(
  z.object({
    fileId: z.string(),
    name: z.string(),
    description: z.string(),
    isHidden: z.boolean().default(false),
  }),
)

export const fileOutputSchema = fileSchema.merge(
  z.object({
    mimeType: z.string(),
    url: downloadUrlSchema.optional(),
  }),
)

export const FileSources = {
  USER_UPLOAD: 'USER_UPLOAD',
}

export type DownloadUrl = z.infer<typeof downloadUrlSchema>
export type File = z.infer<typeof fileSchema>
export type FileAPIInput = Readonly<File>
export type FileAPIOutput = z.infer<typeof fileOutputSchema>
