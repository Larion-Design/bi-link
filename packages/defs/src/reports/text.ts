import { z } from 'zod'

export const reportTextSchema = z.object({
  content: z.string(),
})

export type Text = z.infer<typeof reportTextSchema>
export type TextAPI = Text
