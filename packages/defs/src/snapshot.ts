import { z } from 'zod'
import { withTimestamps } from './modelTimestamps'

export const withSnapshotSchema = z
  .object({
    _id: z.string().uuid(),
    userId: z.string().nullish(),
    serviceId: z.string().nullish(),
    entityId: z.string().nonempty(),
  })
  .merge(withTimestamps)
