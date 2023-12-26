import { z } from 'zod'
import { eventSchema, nodeMetadataSchema } from 'defs'

export const eventGraphSchema = z
  .object({
    date: eventSchema.shape.date.shape.value,
  })
  .merge(nodeMetadataSchema)

export type EventGraphNode = z.infer<typeof eventGraphSchema>
