import { z } from 'zod'
import { termeneDateSchema } from './date'

export const branchesSchema = z.object({
  puncteSiSubsidiare: z
    .object({
      adresa: z.string(),
      tip_sediu: z.string(),
      de_la: termeneDateSchema,
      pana_la: termeneDateSchema,
    })
    .array(),
})
