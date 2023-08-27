import { z } from 'zod'
import { baseField, fieldType } from './base'

export const fieldGroup = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.fieldGroup),
    label: z.string().nullable(),
  }),
)

export type FieldGroup = z.infer<typeof fieldGroup>
