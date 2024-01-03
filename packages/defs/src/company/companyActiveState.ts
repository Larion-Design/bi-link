import { z } from 'zod'
import { booleanWithMetadataSchema } from '../generic'

export const companyActiveStateSchema = z.object({
  ministryOfFinance: booleanWithMetadataSchema,
  tradeRegister: booleanWithMetadataSchema,
})

export type CompanyActiveState = z.infer<typeof companyActiveStateSchema>
