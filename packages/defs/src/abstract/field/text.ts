import { z } from 'zod'
import { nullableNumber } from '../helperTypes'
import { baseField, fieldType } from './base'

export const textField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.text),
    value: z.string(),
    minLength: nullableNumber,
    maxLength: nullableNumber,
  }),
)

export type TextField = z.infer<typeof textField>
