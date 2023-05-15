import { z } from 'zod'
import { companyAPIInputSchema } from 'defs'

export const osintTermeneServiceConfig = z.object({
  getCompanyInfoByCUI: z.function().args(z.string()).returns(companyAPIInputSchema.nullable()),
  getCompanyInfoByName: z.function().args(z.string()).returns(companyAPIInputSchema.nullable()),
})

export type OsintTermeneServiceConfig = z.infer<typeof osintTermeneServiceConfig>
