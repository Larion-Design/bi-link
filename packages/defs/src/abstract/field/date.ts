import { z } from 'zod'
import { nullableDate } from '../helperTypes'
import { baseField, fieldType } from './base'

export const dateField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.date),
    value: nullableDate,
    minDate: nullableDate,
    maxDate: nullableDate,
  }),
)

export type DateField = z.infer<typeof dateField>
