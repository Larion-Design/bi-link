import { z } from 'zod'
import { associatesSchema } from './associates'
import { balanceSheetSchema } from './balanceSheet'
import { branchesSchema } from './branches'
import { CAENCodesSchema } from './caen'
import { contactDetailsSchema } from './contactDetails'
import { courtFilesSchema } from './courtFiles'
import { companyHeaderInfoSchema, companyProfileSchema } from './generalInfo'

export const companyTermeneDatasetSchema = z.object({
  headerInfo: companyHeaderInfoSchema.optional(),
  profileInfo: companyProfileSchema.optional(),
  associates: associatesSchema.optional(),
  contactDetails: contactDetailsSchema.optional(),
  courtCases: courtFilesSchema.optional(),
  caen: CAENCodesSchema.optional(),
  branches: branchesSchema.optional(),
  balanceSheet: balanceSheetSchema.optional(),
})

export const searchCompaniesByNameSchema = z
  .object({
    cui: z.number(),
    nume: z.string(),
  })
  .array()

export type CompanyTermeneDataset = z.infer<typeof companyTermeneDatasetSchema>
