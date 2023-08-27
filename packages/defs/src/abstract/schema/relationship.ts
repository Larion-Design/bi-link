import { z } from 'zod'
import { withTimestamps } from '../../timestamps'
import { dataField } from '../field/union'
import { nonEmptyString } from '../helperTypes'

export const relationshipMapping = z.object({
  from: nonEmptyString,
  to: nonEmptyString,
  data: dataField.array(),
})

export const relationshipTypeSchema = z
  .object({
    _id: nonEmptyString.optional(),
    name: nonEmptyString,
    mappings: relationshipMapping.array(),
    bidirectional: z.boolean().default(false),
  })
  .merge(withTimestamps)

export type RelationshipMapping = z.infer<typeof relationshipMapping>
export type RelationshipType = z.infer<typeof relationshipTypeSchema>
