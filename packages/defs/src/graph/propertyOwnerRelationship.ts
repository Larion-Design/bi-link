import { z } from 'zod'
import { propertyOwnerSchema } from '../property'
import { nodesRelationshipSchema } from './graphBaseRelationship'

export const graphPropertyOwnerSchema = z
  .object({
    startDate: propertyOwnerSchema.shape.startDate.shape.value,
    endDate: propertyOwnerSchema.shape.endDate.shape.value,
  })
  .merge(nodesRelationshipSchema)

export type PropertyOwnerRelationship = z.infer<typeof graphPropertyOwnerSchema>
