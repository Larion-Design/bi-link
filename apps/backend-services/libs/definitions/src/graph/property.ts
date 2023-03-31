import { z } from 'zod'
import { nodeMetadataSchema, propertySchema, vehicleOwnerSchema, vehicleSchema } from 'defs'

const propertyGraphSchema = propertySchema
  .pick({ type: true, name: true })
  .merge(
    z.object({
      type: propertySchema.shape.type,
      name: propertySchema.shape.name,
      vin: vehicleSchema.shape.vin.shape.value,
      plateNumbers: vehicleOwnerSchema.shape.plateNumbers,
    }),
  )
  .merge(nodeMetadataSchema)

export type PropertyGraphNode = z.infer<typeof propertyGraphSchema>
