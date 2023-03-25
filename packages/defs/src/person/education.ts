import { z } from 'zod'
import { dateSchema } from '../date'
import { withMetadataSchema } from '../metadata'

export const educationSchema = withMetadataSchema.merge(
  z.object({
    type: z.string(),
    school: z.string(),
    specialization: z.string(),
    startDate: dateSchema.nullish(),
    endDate: dateSchema.nullish(),
  }),
)

export type Education = z.infer<typeof educationSchema>
export type EducationAPIInput = Education
export type EducationAPIOutput = Education
