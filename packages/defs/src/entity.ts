import { z } from 'zod'

export const entityTypeSchema = z.enum([
  'PERSON',
  'COMPANY',
  'PROPERTY',
  'EVENT',
  'REPORT',
  'FILE',
  'LOCATION',
  'PROCEEDING',
])

export const entityInfoSchema = z.object({
  entityId: z.string().nonempty(),
  entityType: entityTypeSchema,
})

export type EntityInfo = z.infer<typeof entityInfoSchema>
export type EntityType = z.infer<typeof entityTypeSchema>
