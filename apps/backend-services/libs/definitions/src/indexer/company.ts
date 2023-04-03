import { z } from 'zod'
import { Company, companySchema } from 'defs'
import {
  ConnectedCompanyIndex,
  connectedCompanyIndexSchema,
  ConnectedPersonIndex,
  connectedPersonIndexSchema,
  customFieldIndexSchema,
  embeddedFileIndexSchema,
  locationIndexSchema,
} from '@app/definitions'
import { EmbeddedFileIndex } from '@app/definitions'
import { LocationIndex } from '@app/definitions'

export const companyIndexSchema = z.object({
  name: companySchema.shape.name.shape.value,
  cui: companySchema.shape.cui.shape.value,
  registrationNumber: companySchema.shape.registrationNumber.shape.value,
  contactDetails: customFieldIndexSchema.array(),
  customFields: customFieldIndexSchema.array(),
  headquarters: locationIndexSchema.nullish(),
  locations: locationIndexSchema.array(),
  files: embeddedFileIndexSchema.array(),
  associatedCompanies: connectedCompanyIndexSchema.array(),
  associatedPersons: connectedPersonIndexSchema.array(),
})

export const companySearchIndexSchema = companyIndexSchema.pick({
  name: true,
  cui: true,
  registrationNumber: true,
})

export type CompanyIndex = z.infer<typeof companyIndexSchema>
export type CompanySearchIndex = z.infer<typeof companySearchIndexSchema>
