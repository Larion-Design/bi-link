import { z } from 'zod'

export const tableSchema = z.object({
  id: z.string(),
})

export type Table = z.infer<typeof tableSchema>
export type TableAPI = Table
