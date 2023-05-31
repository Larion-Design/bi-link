import { z } from 'zod'
import { textWithMetadataSchema } from '../generic'

export const companyStatusSchema = z.object({
  vat: textWithMetadataSchema,
  fiscal: textWithMetadataSchema,
})

export type CompanyStatus = z.infer<typeof companyStatusSchema>
