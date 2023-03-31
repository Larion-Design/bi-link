import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileInputSchema, fileOutputSchema, fileSchema } from '../file'
import { withMetadataSchema } from '../metadata'
import { withTimestamps } from '../modelTimestamps'
import { SearchSuggestions } from '../searchSuggestions'
import { propertyOwnerAPISchema, propertyOwnerSchema } from './propertyOwner'
import { realEstateSchema } from './realEstateInfo'
import { vehicleSchema } from './vehicleInfo'

export const propertySchema = z
  .object({
    _id: z.string().uuid(),
    name: z.string(),
    type: z.string(),
    customFields: customFieldSchema.array(),
    files: fileSchema.array(),
    images: fileSchema.array(),
    owners: propertyOwnerSchema.array(),
    vehicleInfo: vehicleSchema.nullish(),
    realEstateInfo: realEstateSchema.nullish(),
  })
  .merge(withMetadataSchema)
  .merge(withTimestamps)

export const propertyAPIOutputSchema = propertySchema.merge(
  z.object({
    files: fileOutputSchema.array(),
    images: fileOutputSchema.array(),
    owners: propertyOwnerAPISchema.array(),
  }),
)

export const propertyAPIInputSchema = propertySchema.omit({ _id: true }).merge(
  z.object({
    files: fileInputSchema.array(),
    images: fileInputSchema.array(),
    owners: z.array(propertyOwnerAPISchema),
  }),
)

export const propertyListRecordSchema = propertyAPIOutputSchema.pick({
  _id: true,
  name: true,
  type: true,
})

export type Property = z.infer<typeof propertySchema>
export type PropertyAPIInput = z.infer<typeof propertyAPIInputSchema>
export type PropertyAPIOutput = z.infer<typeof propertyAPIOutputSchema>
export type PropertyListRecord = z.infer<typeof propertyListRecordSchema>

export interface PropertiesSuggestions extends SearchSuggestions<PropertyListRecord> {}
