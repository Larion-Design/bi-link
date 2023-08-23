import { z } from 'zod'

export const referenceSchema = z.object({
  _id: z.string().nonempty().nullish(),
  entityId: z.string().nonempty(),
  groupId: z.string().nonempty().nullish(),
  fieldId: z.string().nonempty(),
})

export type Reference = z.infer<typeof referenceSchema>
