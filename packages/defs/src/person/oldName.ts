import { z } from 'zod'
import { withMetadataSchema } from '../metadata'

export const oldNameSchema = z
  .object({
    _id: z.string().optional(),
    name: z.string(),
    changeReason: z.string(),
  })
  .merge(withMetadataSchema)

export type OldName = z.infer<typeof oldNameSchema>
