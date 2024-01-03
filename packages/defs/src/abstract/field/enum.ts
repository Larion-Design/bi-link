import { z } from 'zod'
import { nonEmptyString } from '../helperTypes'
import { baseField, fieldType } from './base'

export const enumField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.enum),
    options: nonEmptyString.array(),
    value: nonEmptyString.nullable(),
  }),
)

export type EnumField = z.infer<typeof enumField>
