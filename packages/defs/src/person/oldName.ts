import { z } from 'zod'
import { withMetadataSchema } from '../metadata'

export const oldNameSchema = withMetadataSchema.merge(
  z.object({
    name: z.string(),
    changeReason: z.string(),
  }),
)

export type OldName = z.infer<typeof oldNameSchema>
export type OldNameAPIInput = OldName
export type OldNameAPIOutput = OldName
