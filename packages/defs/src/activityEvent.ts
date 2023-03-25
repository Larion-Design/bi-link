import { z } from 'zod'
import { entityInfoSchema } from './entity'

export const activityEventSchema = z.object({
  _id: z.string(),
  timestamp: z.number(),
  eventType: z.string(),
  author: z.string().nullish(),
  targetEntityInfo: entityInfoSchema,
})

export type ActivityEvent = z.infer<typeof activityEventSchema>
