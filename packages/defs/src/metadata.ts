import { z } from 'zod'

export const trustworthinessSchema = z.object({
  source: z.string(),
  level: z.number().gte(1).lte(5),
})

export const metadataSchema = z.object({
  access: z.string(),
  confirmed: z.boolean(),
  trustworthiness: trustworthinessSchema,
})

export const withMetadataSchema = z.object({
  metadata: metadataSchema,
})

export type Metadata<T = {}> = z.infer<typeof metadataSchema> & T
export type Trustworthiness = z.infer<typeof trustworthinessSchema>
export type WithMetadata = z.infer<typeof withMetadataSchema>
