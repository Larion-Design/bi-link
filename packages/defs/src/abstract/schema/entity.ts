import { z } from 'zod'
import { relationshipField } from '../field/relationship'
import { withTimestamps } from '../../timestamps'
import { dataField } from '../field/union'
import { nonEmptyString } from '../helperTypes'

export const entityMetadataSchema = z.record(nonEmptyString, nonEmptyString)

export const entitySchema = z
  .object({
    _id: nonEmptyString.nullish(),
    name: z.string(),
    data: dataField.or(relationshipField).array(),
    metadata: entityMetadataSchema,
  })
  .merge(withTimestamps)

export type EntityMetadata = z.infer<typeof entityMetadataSchema>
export type Entity = z.infer<typeof entitySchema>
