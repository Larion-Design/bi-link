import { z } from 'zod'

export const filesManagerInterfaceSchema = z.object({
  uploadFile: z
    .function()
    .args(z.instanceof(Buffer))
    .returns(
      z.object({
        fileId: z.string().nonempty(),
        hash: z.string().nonempty(),
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
    .returns(z.string().url()),

  getFilesDownloadUrls: z
    .function()
    .args(
      z.object({
        filesIds: z.string().nonempty().array(),
        ttl: z.number().int(),
      }),
    )
    .returns(z.record(z.string().nonempty(), z.string().url())),
})

export type FilesManagerServiceMethods = z.infer<typeof filesManagerInterfaceSchema>
