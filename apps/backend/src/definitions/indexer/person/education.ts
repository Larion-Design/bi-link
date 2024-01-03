import { z } from 'zod'
import { educationSchema } from 'defs'

export const educationIndexSchema = educationSchema
  .pick({
    type: true,
    school: true,
    specialization: true,
  })
  .merge(
    z.object({
      period: z.object({
        gte: z.string().optional(),
        lte: z.string().optional(),
      }),
    }),
  )

export type EducationIndex = z.infer<typeof educationIndexSchema>
