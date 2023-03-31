import { entityInfoSchema } from 'defs'
import { z } from 'zod'

export const globalEventsInterfaceSchema = z.object({
  dispatchEntityCreated: z.function().args(entityInfoSchema),
  dispatchEntityUpdated: z.function().args(entityInfoSchema),
})

export type GlobalEventsServiceMethods = z.infer<typeof globalEventsInterfaceSchema>
