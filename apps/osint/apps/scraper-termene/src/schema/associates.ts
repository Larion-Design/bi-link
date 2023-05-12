import { z } from 'zod'

const associateSchema = z.object({
  functiune: z.boolean(),
  nume: z.string(),
  procentaj: z.union([z.number(), z.string()]),
  functie: z.string(),
  cui: z.number().optional(),
  dataNastere: z.string().optional(),
  tipAA: z.enum(['firma', 'persoana']),
})

export const associatesSchema = z.object({
  asociatiAdministratori: z.object({
    asociati: associateSchema.array(),
    administratori: associateSchema.array(),
  }),
})
