import { z } from 'zod'
import { customFieldSchema } from 'defs'

export const customFieldIndexSchema = customFieldSchema.omit({
  metadata: true,
})

export type CustomFieldIndex = z.infer<typeof customFieldIndexSchema>
