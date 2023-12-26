import { z } from 'zod'
import { activityEventSchema } from 'defs'

export const activityEventIndexSchema = activityEventSchema.omit({ _id: true })
export type ActivityEventIndex = z.infer<typeof activityEventIndexSchema>
