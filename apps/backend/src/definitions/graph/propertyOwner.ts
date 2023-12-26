import { z } from 'zod'
import { graphRelationshipMetadataSchema, vehicleOwnerSchema } from 'defs'

export const propertyOwnerRelationshipSchema = z
  .object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    plateNumbers: vehicleOwnerSchema.shape.plateNumbers.optional(),
  })
  .merge(graphRelationshipMetadataSchema)

export type PropertyOwnerGraphRelationship = z.infer<typeof propertyOwnerRelationshipSchema>
