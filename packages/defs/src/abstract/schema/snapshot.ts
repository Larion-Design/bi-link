import { z } from 'zod'
import { withTimestamps } from '../../timestamps'
import { nonEmptyString } from '../helperTypes'
import { entitySchema } from './entity'

export const snapshotSchema = z
  .object({
    _id: nonEmptyString.nullish(),
    entityId: nonEmptyString,
    data: entitySchema,
  })
  .merge(withTimestamps)

export type Snapshot = z.infer<typeof snapshotSchema>
