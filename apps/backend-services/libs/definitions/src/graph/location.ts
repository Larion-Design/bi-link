import { z } from 'zod'
import { coordinatesSchema, nodeMetadataSchema } from 'defs'

export const locationGraphSchema = z
  .object({
    address: z.string(),
  })
  .merge(coordinatesSchema.partial())
  .merge(nodeMetadataSchema)

export type LocationGraphNode = z.infer<typeof locationGraphSchema>
