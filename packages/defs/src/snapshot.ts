import { z } from 'zod'
import { withTimestamps } from './timestamps'
import { updateSourceSchema } from './updateSource'

export const withSnapshotSchema = z
  .object({
    _id: z.string().uuid(),
    entityId: z.string().nonempty(),
    source: updateSourceSchema,
  })
  .merge(withTimestamps)
