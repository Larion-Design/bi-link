import { z } from 'zod'

export const linkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
})

export type Link = z.infer<typeof linkSchema>
export type LinkAPI = Link
