import { z } from 'zod'

export const branchesSchema = z.object({
  puncteSiSubsidiare: z
    .object({
      adresa: z.string(),
      tip_sediu: z.string(),
      de_la: z.string(),
      pana_la: z.string(),
    })
    .array(),
})
