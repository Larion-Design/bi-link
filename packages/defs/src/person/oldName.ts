import { z } from 'zod'
import { textWithMetadataSchema } from '../generic'

export const oldNameSchema = z.object({
  name: textWithMetadataSchema,
  changeReason: textWithMetadataSchema,
})

export type OldName = z.infer<typeof oldNameSchema>
export type OldNameAPIInput = OldName
export type OldNameAPIOutput = OldName
