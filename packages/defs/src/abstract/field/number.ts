import { z } from 'zod'
import { nullableNumber, numberWithDefaultZero } from '../helperTypes'
import { baseField, fieldType } from './base'

export const numberField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.number),
    value: numberWithDefaultZero,
    floatDigits: z.number().default(0),
    min: nullableNumber,
    max: nullableNumber,
  }),
)

export type NumberField = z.infer<typeof numberField>
