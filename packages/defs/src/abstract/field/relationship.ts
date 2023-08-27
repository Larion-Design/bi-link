import { z } from 'zod'
import { relationshipMapping, relationshipTypeSchema } from '../schema/relationship'
import { baseField, fieldType } from './base'

export const relationshipField = baseField.merge(
  z.object({
    _type: z.literal(fieldType.enum.relationship),
    relationship: relationshipTypeSchema
      .pick({
        name: true,
        bidirectional: true,
      })
      .merge(relationshipMapping.pick({ data: true })),
  }),
)

export type RelationshipField = z.infer<typeof relationshipField>
