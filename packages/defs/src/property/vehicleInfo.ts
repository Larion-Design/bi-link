import { z } from 'zod'
import { textWithMetadataSchema } from '../generic'

export const vehicleSchema = z.object({
  vin: textWithMetadataSchema,
  maker: textWithMetadataSchema,
  model: textWithMetadataSchema,
  color: textWithMetadataSchema,
})

export type VehicleInfo = z.infer<typeof vehicleSchema>
export type VehicleInfoAPI = VehicleInfo
