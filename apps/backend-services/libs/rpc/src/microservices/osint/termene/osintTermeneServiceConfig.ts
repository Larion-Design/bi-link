import { z } from 'zod'

export const osintTermeneServiceConfig = z.object({
  getCompanyInfoByCUI: z.function().args(z.string()).returns(z.string()),
  getCompanyInfoByName: z.function().args(z.string()).returns(z.string()),
})

export type OsintTermeneServiceConfig = z.infer<typeof osintTermeneServiceConfig>
