import { z } from 'zod'
import { withMetadataSchema } from './metadata'

export const customFieldSchema = z
  .object({
    _id: z.string().optional(),
    fieldName: z.string().min(1),
    fieldValue: z.string(),
  })
  .merge(withMetadataSchema)

export type CustomField = z.infer<typeof customFieldSchema>
export type CustomFieldAPI = CustomField
