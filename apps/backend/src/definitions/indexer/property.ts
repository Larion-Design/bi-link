import { z } from 'zod'
import { propertySchema, realEstateSchema, vehicleOwnerSchema, vehicleSchema } from 'defs'
import { connectedCompanyIndexSchema, connectedPersonIndexSchema } from './connectedEntity'
import { locationIndexSchema } from './location'
import { embeddedFileIndexSchema } from './file'
import { customFieldIndexSchema } from './customField'

export const vehicleIndexSchema = z.object({
  vin: vehicleSchema.shape.vin.shape.value,
  model: vehicleSchema.shape.model.shape.value,
  maker: vehicleSchema.shape.maker.shape.value,
  color: vehicleSchema.shape.color.shape.value,
  plateNumbers: vehicleOwnerSchema.shape.plateNumbers,
})

export const realEstateIndex = z.object({
  surface: realEstateSchema.shape.surface.shape.value,
  townArea: realEstateSchema.shape.townArea.shape.value,
  location: locationIndexSchema.optional(),
})

export const propertyIndexSchema = propertySchema.pick({ name: true, type: true }).merge(
  z.object({
    files: embeddedFileIndexSchema.array(),
    vehicleInfo: vehicleIndexSchema.optional(),
    realEstateInfo: realEstateIndex.optional(),
    personsOwners: connectedPersonIndexSchema.array(),
    companiesOwners: connectedCompanyIndexSchema.array(),
    customFields: customFieldIndexSchema.array(),
  }),
)

export const propertySearchIndexSchema = propertyIndexSchema.pick({
  name: true,
  type: true,
})

export type VehicleInfoIndex = z.infer<typeof vehicleIndexSchema>
export type RealEstateInfoIndex = z.infer<typeof realEstateIndex>
export type PropertyIndex = z.infer<typeof propertyIndexSchema>
export type PropertySearchIndex = z.infer<typeof propertySearchIndexSchema>
