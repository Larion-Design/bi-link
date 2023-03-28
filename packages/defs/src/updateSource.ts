import { z } from 'zod'

export const updateSourceSchema = z.object({
  type: z.enum(['USER', 'SERVICE']),
  sourceId: z.string().nonempty(),
})

export type UpdateSource = z.infer<typeof updateSourceSchema>
