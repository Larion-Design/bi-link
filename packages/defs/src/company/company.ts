import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileOutputSchema, fileSchema } from '../file'
import { textWithMetadataSchema } from '../generic'
import { locationSchema } from '../geolocation'
import { withMetadataSchema } from '../metadata'
import { withTimestamps } from '../modelTimestamps'
import { SearchSuggestions } from '../searchSuggestions'
import { associateAPISchema, associateSchema } from './associate'

export const companySchema = z
  .object({
    _id: z.string().uuid(),
    cui: textWithMetadataSchema,
    name: textWithMetadataSchema,
    headquarters: locationSchema.nullable(),
    registrationNumber: textWithMetadataSchema,
    contactDetails: z.array(customFieldSchema),
    locations: z.array(locationSchema),
    associates: z.array(associateSchema),
    customFields: z.array(customFieldSchema),
    files: z.array(fileSchema),
  })
  .merge(withMetadataSchema)
  .merge(withTimestamps)

export const companyListRecordSchema = companySchema.pick({
  _id: true,
  name: true,
  registrationNumber: true,
  cui: true,
})

const companyAPIOutputSchema = companySchema.merge(
  z.object({
    associates: z.array(associateAPISchema),
    files: z.array(fileOutputSchema),
  }),
)

export const companyAPIInputSchema = companySchema.omit({ _id: true }).merge(
  z.object({
    associates: z.array(associateAPISchema),
  }),
)

export type Company = z.infer<typeof companySchema>
export type CompanyListRecord = z.infer<typeof companyListRecordSchema>
export type CompanyAPIOutput = z.infer<typeof companyAPIOutputSchema>
export type CompanyAPIInput = z.infer<typeof companyAPIInputSchema>

export interface CompaniesSuggestions extends SearchSuggestions<CompanyListRecord> {}
