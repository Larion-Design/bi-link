import { z } from 'zod'
import { termeneDateSchema } from './date'

const associateBaseSchema = z.object({
  entityUrl: z.string().default('').optional(),
  functiune: z.boolean(),
  adresa: z.string(),
  nume: z.string(),
  procentaj: z.union([z.number(), z.string()]),
  functie: z.string(),
})

const personAssociateSchema = associateBaseSchema.merge(
  z.object({
    dataNastere: termeneDateSchema,
    tipAA: z.literal('persoana'),
  }),
)

const companyAssociateSchema = associateBaseSchema.merge(
  z.object({
    cui: z.number().transform((value) => String(value)),
    tipAA: z.literal('firma'),
  }),
)

const associateSchema = z.union([personAssociateSchema, companyAssociateSchema])

export const associatesSchema = z.object({
  asociatiAdministratori: z.object({
    asociati: associateSchema.array(),
    administratori: associateSchema.array(),
  }),
})

export type TermeneAssociateSchema = z.infer<typeof associateSchema>
export type TermeneAssociatesSchema = z.infer<typeof associatesSchema>
export type TermeneCompanyAssociate = z.infer<typeof companyAssociateSchema>
export type TermenePersonAssociate = z.infer<typeof personAssociateSchema>
