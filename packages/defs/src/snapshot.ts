import { z } from 'zod'

export const withSnapshotSchema = z.object({
  _id: z.string().uuid(),
  userId: z.string().nullish(),
  serviceId: z.string().nullish(),
  dateCreated: z.date(),
  entityId: z.string().uuid(),
})
