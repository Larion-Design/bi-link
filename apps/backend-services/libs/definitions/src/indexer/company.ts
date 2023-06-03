import { balanceSheetIndex } from '@app/definitions/indexer/company/balanceSheet'
import { z } from 'zod'
import { companySchema } from 'defs'
import { connectedCompanyIndexSchema, connectedPersonIndexSchema } from './connectedEntity'
import { locationIndexSchema } from './location'
import { embeddedFileIndexSchema } from './file'
import { customFieldIndexSchema } from './customField'

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
  balanceSheets: balanceSheetIndex.array(),
})

export const companySearchIndexSchema = companyIndexSchema.pick({
  name: true,
  cui: true,
  registrationNumber: true,
})

export type CompanyIndex = z.infer<typeof companyIndexSchema>
export type CompanySearchIndex = z.infer<typeof companySearchIndexSchema>
