import { z } from 'zod'
import { connectedEntitySchema } from '../connectedEntity'
import { dateSchema } from '../date'
import { withMetadataSchema } from '../metadata'

export const educationSchema = z
  .object({
    _id: z.string().optional(),
    type: z.string(),
    school: z.string(),
    specialization: z.string(),
    startDate: dateSchema.nullish(),
    endDate: dateSchema.nullish(),
    company: connectedEntitySchema.nullish(),
  })
  .merge(withMetadataSchema)

export type Education = z.infer<typeof educationSchema>
export type EducationAPIInput = Education
export type EducationAPIOutput = Education
