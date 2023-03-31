import { z } from 'zod'
import { activityEventInputSchema, activityEventSchema } from 'defs'

export const activityHistoryInterfaceSchema = z.object({
  recordAction: z.function().args(activityEventInputSchema),
  getActivityEvents: z
    .function()
    .args(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .returns(activityEventSchema.array()),
})

export type ActivityHistoryServiceMethods = z.infer<typeof activityHistoryInterfaceSchema>
