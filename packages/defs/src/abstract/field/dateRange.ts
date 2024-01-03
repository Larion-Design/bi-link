import { z } from 'zod'
import { nullableDate } from '../helperTypes'
import { baseField, fieldType } from './base'

export const dateRangeField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.dateRange),
    value: z.tuple([nullableDate, nullableDate]),
    minDate: nullableDate,
    maxDate: nullableDate,
  }),
)

export type DateRangeField = z.infer<typeof dateRangeField>
