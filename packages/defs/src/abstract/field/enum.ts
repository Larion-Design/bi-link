import { z } from 'zod'
import { nonEmptyString } from '../helperTypes'
import { baseField, fieldType } from './base'

export const enumField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.enum),
    options: nonEmptyString.array(),
    value: z.tuple([z.number().nullable(), z.number().nullable()]),
  }),
)

export type EnumField = z.infer<typeof enumField>
