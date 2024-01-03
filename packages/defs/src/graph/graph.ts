import { z } from 'zod'
import { graphEntitiesSchema } from './graphEntities'
import { graphRelationshipsSchema } from './graphRelationships'

export const graphSchema = z.object({
  relationships: graphRelationshipsSchema,
  entities: graphEntitiesSchema,
})

export type Graph = z.infer<typeof graphSchema>
