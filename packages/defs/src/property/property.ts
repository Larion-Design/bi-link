import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileOutputSchema, fileSchema } from '../file'
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
    customFields: z.array(customFieldSchema),
    files: z.array(fileSchema),
    images: z.array(fileSchema),
    owners: z.array(propertyOwnerSchema),
    vehicleInfo: vehicleSchema.nullish(),
    realEstateInfo: realEstateSchema.nullish(),
  })
  .merge(withMetadataSchema)
  .merge(withTimestamps)

export const propertyAPIOutputSchema = propertySchema.merge(
  z.object({
    files: z.array(fileOutputSchema),
    owners: z.array(propertyOwnerAPISchema),
  }),
)

export const propertyAPIInputSchema = propertySchema.merge(
  z.object({
    owners: z.array(propertyOwnerAPISchema),
  }),
)

export const propertyListRecordSchema = propertySchema.pick({ _id: true, name: true, type: true })

export type Property = z.infer<typeof propertySchema>
export type PropertyAPIInput = z.infer<typeof propertyAPIInputSchema>
export type PropertyAPIOutput = z.infer<typeof propertyAPIOutputSchema>
export type PropertyListRecord = z.infer<typeof propertyListRecordSchema>

export interface PropertiesSuggestions extends SearchSuggestions<PropertyListRecord> {}
