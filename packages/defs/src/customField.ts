import { z } from 'zod'
import { withMetadataSchema } from './metadata'

export const customFieldSchema = withMetadataSchema.merge(
  z.object({
    fieldName: z.string().min(1),
    fieldValue: z.string(),
  }),
)

export type CustomField = z.infer<typeof customFieldSchema>
export type CustomFieldAPI = CustomField
