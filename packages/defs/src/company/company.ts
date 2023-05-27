import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { fileInputSchema, fileOutputSchema, fileSchema } from '../file'
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
    contactDetails: customFieldSchema.array(),
    locations: locationSchema.array(),
    associates: associateSchema.array(),
    customFields: customFieldSchema.array(),
    files: fileSchema.array(),
  })
  .merge(withMetadataSchema)
  .merge(withTimestamps)

export const companyListRecordSchema = companySchema
  .pick({
    _id: true,
  })
  .merge(
    z.object({
      name: companySchema.shape.name.shape.value,
      registrationNumber: companySchema.shape.registrationNumber.shape.value,
      cui: companySchema.shape.cui.shape.value,
    }),
  )

export const companyAPIOutputSchema = companySchema.merge(
  z.object({
    associates: associateAPISchema.array(),
    files: fileOutputSchema.array(),
  }),
)

export const companyAPIInputSchema = companySchema.omit({ _id: true }).merge(
  z.object({
    associates: associateAPISchema.array(),
    files: fileInputSchema.array(),
  }),
)

export const OSINTCompanySchema = z.object({
  name: companySchema.shape.name.shape.value,
  cui: companySchema.shape.cui.shape.value,
  registrationNumber: companySchema.shape.registrationNumber.shape.value.optional(),
  headquarters: z.string().optional(),
})

export type Company = z.infer<typeof companySchema>
export type CompanyListRecord = z.infer<typeof companyListRecordSchema>
export type CompanyAPIOutput = z.infer<typeof companyAPIOutputSchema>
export type CompanyAPIInput = z.infer<typeof companyAPIInputSchema>
export type OSINTCompany = z.infer<typeof OSINTCompanySchema>

export interface CompaniesSuggestions extends SearchSuggestions<CompanyListRecord> {}
