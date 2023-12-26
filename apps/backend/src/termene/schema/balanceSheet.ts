import { z } from 'zod'

const nullableNumber = z.number().nullable()

export const balanceSheetSchema = z.object({
  balanceSheet: z
    .object({
      _id: z.string().optional(),
      an: z.number(),
      active_imobilizate: nullableNumber,
      active_circulante: nullableNumber,
      stocuri: nullableNumber,
      creante: nullableNumber,
      casa_si_conturi_la_banci: nullableNumber,
      cheltuieli_in_avant: nullableNumber,
      datorii: nullableNumber,
      venituri_in_avans: nullableNumber,
      provizioane: nullableNumber,
      capital_total: nullableNumber,
      capital_social: nullableNumber,
      patrimoniu_regie: nullableNumber,
      patrimoniu_public: nullableNumber,
      cifra_de_afaceri_neta: nullableNumber,
      venituri_total: nullableNumber,
      cheltuieli_totale: nullableNumber,
      profit_pierdere_bruta: nullableNumber,
      profit_brut: nullableNumber,
      pierdere_brut: nullableNumber,
      profitul_sau_pierdere_neta: nullableNumber,
      profit_net: nullableNumber,
      pierdere_net: nullableNumber,
      numar_mediu_angajati: z.number(),
      cod_caen: z.number(),
      tip_activitate: z.string(),
      date: z.union([z.date(), z.string()]),
      tip_bilant: z.string().nullable(),
      lastModified: z.union([z.date(), z.string()]),
    })
    .array(),
})
