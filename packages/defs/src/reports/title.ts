import { z } from 'zod'

export const titleSchema = z.object({
  content: z.string(),
})

export type Title = z.infer<typeof titleSchema>
export type TitleAPI = Title
