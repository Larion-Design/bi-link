import { z } from 'zod'
import { userSchema } from './user'

export const withSnapshotSchema = z.object({
  _id: z.string().uuid(),
  user: userSchema.nullish(),
  service: z.string().nullish(),
  dateCreated: z.date(),
  entityId: z.string().uuid(),
})

export type EntitySnapshot = z.infer<typeof withSnapshotSchema>
