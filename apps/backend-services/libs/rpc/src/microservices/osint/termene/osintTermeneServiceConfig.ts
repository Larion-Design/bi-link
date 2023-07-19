import { z } from 'zod'
import { OSINTCompanySchema, OSINTPersonSchema } from 'defs'

export const osintTermeneServiceConfig = z.object({
  searchCompaniesByName: z
    .function()
    .args(z.string().nonempty())
    .returns(OSINTCompanySchema.array()),
  searchPersons: z.function().args(z.string().nonempty()).returns(OSINTPersonSchema.array()),
  searchProceedings: z.function().args(z.string().nonempty()).returns(z.unknown().array()),

  importCompany: z.function().args(z.string().nonempty()),
  importPersonCompanies: z.function().args(z.string().nonempty().url()),
  importProceeding: z.function().args(z.string().nonempty()),
})

export type OsintTermeneServiceConfig = z.infer<typeof osintTermeneServiceConfig>
