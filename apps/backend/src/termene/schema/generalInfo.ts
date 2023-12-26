import { z } from 'zod'
import { termeneDateSchema } from './date'

export const companyHeaderInfoSchema = z.object({
  firma: z.object({
    cui: z.number(),
    nume_canonic: z.string(),
    j: z.string(),
  }),
  stare_firma: z.object({
    mfinante: z.object({
      curenta: z.object({
        functiune: z.boolean(),
      }),
    }),
    recom: z.object({
      curenta: z.object({
        functiune: z.boolean(),
      }),
    }),
  }),
  statut_fiscal: z.object({
    curent: z.object({
      label: z.string(),
    }),
  }),
  statut_tva: z.object({
    curent: z.object({
      label: z.string(),
    }),
  }),
})

export const companyProfileSchema = z.object({
  firma: z.object({
    cui: z.number(),
    j: z.string(),
  }),
  cod_caen: z.object({
    principal_mfinante: z.object({
      cod: z.number(),
      label: z.string(),
    }),
  }),
  adresa: z.object({
    sediu_social: z.object({
      formatat: z.string(),
      cod_postal: z.number(),
      judet: z.string(),
      localitate: z.string(),
    }),
  }),
  bilanturi_mfinante_scurte: z.object({
    ultimul_raportat: z.object({
      an: z.number(),
      cifra_de_afaceri_neta: z.object({
        valoare: z.number(),
        tendinta: z.object({
          valoare: z.number(),
        }),
      }),
      profit_pierdere_neta: z.object({
        valoare: z.number(),
        tendinta: z.object({
          valoare: z.number(),
        }),
      }),
      numar_mediu_angajati: z.object({
        valoare: z.number(),
        tendinta: z.object({
          valoare: z.number(),
        }),
      }),
    }),
  }),
  data_infiintarii: z.object({
    data: termeneDateSchema,
  }),
})
