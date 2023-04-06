import { z } from 'zod'
import { withMetadataSchema } from '../metadata'
import { connectedEntitySchema } from '../connectedEntity'

export const relationshipSchema = z
  .object({
    type: z.string(),
    proximity: z.number(),
    description: z.string(),
    relatedPersons: connectedEntitySchema.array(),
    person: connectedEntitySchema,
  })
  .merge(withMetadataSchema)

export type Relationship = z.infer<typeof relationshipSchema>
export type RelationshipAPI = Relationship
