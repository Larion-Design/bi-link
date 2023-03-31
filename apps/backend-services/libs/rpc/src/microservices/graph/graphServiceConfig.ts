import { z } from 'zod'
import { entityTypeSchema, graphRelationshipsSchema } from 'defs'

export const graphInterfaceSchema = z.object({
  refreshNodes: z.function().args(entityTypeSchema),
  getEntityRelationships: z
    .function()
    .args(
      z.object({
        entityId: z.string().uuid(),
        depth: z.number().min(1),
      }),
    )
    .returns(graphRelationshipsSchema),
})

export type GraphServiceMethods = z.infer<typeof graphInterfaceSchema>
