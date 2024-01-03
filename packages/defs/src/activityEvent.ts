import { z } from 'zod'
import { entityInfoSchema } from './entity'
import { updateSourceSchema } from './updateSource'

export const activityEventSchema = z.object({
  _id: z.string(),
  timestamp: z.number(),
  eventType: z.string(),
  author: updateSourceSchema,
  targetEntityInfo: entityInfoSchema,
})

export const activityEventInputSchema = activityEventSchema.omit({ _id: true })

export type ActivityEvent = z.infer<typeof activityEventSchema>
export type ActivityEventInput = z.infer<typeof activityEventInputSchema>
