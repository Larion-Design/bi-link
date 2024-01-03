import { z } from 'zod'
import { companySchema } from '../company'
import { connectedEntitySchema } from '../connectedEntity'
import { optionalDateWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { withMetadataSchema } from '../metadata'

export const workplaceSchema = z
  .object({
    _id: z.string().optional(),
    company: companySchema.nullish(),
    startDate: optionalDateWithMetadataSchema,
    endDate: optionalDateWithMetadataSchema,
    role: textWithMetadataSchema,
    description: z.string(),
  })
  .merge(withMetadataSchema)

export const workplaceAPISchema = workplaceSchema.merge(
  z.object({
    company: connectedEntitySchema.nullish(),
  }),
)

export type Workplace = z.infer<typeof workplaceSchema>
export type WorkplaceAPI = z.infer<typeof workplaceAPISchema>
