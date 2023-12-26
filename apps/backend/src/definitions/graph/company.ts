import { z } from 'zod'
import { companySchema } from 'defs'

export const companyGraphNodeSchema = companySchema.pick({ _id: true }).merge(
  z.object({
    name: companySchema.shape.name.shape.value,
    cui: companySchema.shape.cui.shape.value,
    registrationNumber: companySchema.shape.registrationNumber.shape.value,
  }),
)

export type CompanyGraphNode = z.infer<typeof companyGraphNodeSchema>
