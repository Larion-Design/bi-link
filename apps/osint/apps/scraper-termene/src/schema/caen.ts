import { z } from 'zod'

export const CAENCodesSchema = z.object({
  cod_caen: z.object({
    secundare_recom: z.object({
      lista: z
        .object({
          label: z.string(),
          cod: z.union([z.string(), z.number()]),
        })
        .array(),
    }),
  }),
})
