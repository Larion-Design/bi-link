import { z } from 'zod'
import { termeneDateSchema } from './date'

const termeneInvolvedEntity = z.object({
  denumire: z.string(),
  calitate: z.string(),
  tip: z.enum(['PJ', 'PF']),
  cui: z.union([z.string(), z.number()]).nullish(),
})

export const termeneProceedingSchema = z.object({
  data_dosar: termeneDateSchema,
  oras: z.string(),
  nume_scurt_stadiu_procesual: z.string(),
  id: z.union([z.string(), z.number()]),
  materie_juridica_afisare: z.string(),
  id_sectie: z.union([z.string(), z.number()]),
  obiect_afisare: z.string(),
  nume_scurt_materie_juridica: z.string(),
  nr_dosar: z.string(),
  nume_instanta: z.string(),
  id_instanta: z.union([z.string(), z.number()]),
  tip_instanta: z.string(),
  parti: termeneInvolvedEntity.array(),
})

export const courtFilesSchema = z.object({
  rezultatele_cautarii: termeneProceedingSchema.array(),
})

export type TermeneProceedingsSchema = z.infer<typeof courtFilesSchema>
export type TermeneProceeding = z.infer<typeof termeneProceedingSchema>
export type TermeneInvolvedEntity = z.infer<typeof termeneInvolvedEntity>
