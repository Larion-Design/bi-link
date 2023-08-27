import { z } from 'zod'
import { nonEmptyString } from '../helperTypes'

export const referenceSchema = z.object({
  _id: nonEmptyString.optional(),
  entityId: nonEmptyString,
  fieldId: nonEmptyString,
})

export type Reference = z.infer<typeof referenceSchema>
