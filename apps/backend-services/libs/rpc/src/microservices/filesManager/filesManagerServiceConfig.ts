import { downloadUrlSchema } from 'defs'
import { z } from 'zod'

export const filesManagerInterfaceSchema = z.object({
  uploadFile: z
    .function()
    .args(
      z.object({
        mimeType: z.string().nonempty(),
        content: z.string().nonempty(),
      }),
    )
    .returns(
      z.object({
        fileId: z.string().nonempty(),
        hash: z.string().nonempty(),
        created: z.boolean(),
      }),
    ),

  getFileContent: z.function().args(z.string().nonempty()).returns(z.instanceof(Buffer)),

  getFileDownloadUrl: z
    .function()
    .args(
      z.object({
        fileId: z.string().nonempty(),
        ttl: z.number().int(),
      }),
    )
    .returns(downloadUrlSchema),

  getFilesDownloadUrls: z
    .function()
    .args(
      z.object({
        filesIds: z.string().nonempty().array(),
        ttl: z.number().int(),
      }),
    )
    .returns(downloadUrlSchema.array()),
})

export type FilesManagerServiceMethods = z.infer<typeof filesManagerInterfaceSchema>
