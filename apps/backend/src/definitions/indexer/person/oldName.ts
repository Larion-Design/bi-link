import { z } from 'zod'
import { oldNameSchema } from 'defs'

export const oldNameIndexSchema = oldNameSchema.omit({ metadata: true })
export type OldNameIndex = z.infer<typeof oldNameIndexSchema>
