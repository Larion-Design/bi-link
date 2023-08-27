import { z } from 'zod'
import { baseField, fieldType } from './base'

export const numberRangeField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.numberRange),
    value: z.tuple([z.number().nullable(), z.number().nullable()]),
  }),
)

export type NumberRangeField = z.infer<typeof numberRangeField>
