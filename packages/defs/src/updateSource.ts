import { z } from 'zod'

export const updateSourceSchema = z.union([
  z.object({
    type: z.literal('USER'),
    sourceId: z.string().nonempty(),
  }),

  z.object({
    type: z.literal('SERVICE'),
    sourceId: z.enum(['SERVICE_INDEXER', 'SERVICE_GRAPH', 'SERVICE_API', 'SERVICE_INGRESS']),
  }),
])

export type UpdateSource = z.infer<typeof updateSourceSchema>
