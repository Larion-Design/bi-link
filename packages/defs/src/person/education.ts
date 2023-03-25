import { z } from 'zod'
import { customFieldSchema } from '../customField'
import { optionalDateWithMetadataSchema, textWithMetadataSchema } from '../generic'
import { withMetadataSchema } from '../metadata'

export const educationSchema = withMetadataSchema.merge(
  z.object({
    type: textWithMetadataSchema,
    school: textWithMetadataSchema,
    specialization: textWithMetadataSchema,
    customFields: z.array(customFieldSchema),
    startDate: optionalDateWithMetadataSchema,
    endDate: optionalDateWithMetadataSchema,
  }),
)

export type Education = z.infer<typeof educationSchema>
export type EducationAPIInput = Education
export type EducationAPIOutput = Education
