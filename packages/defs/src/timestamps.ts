import { z } from 'zod'

export const withTimestamps = z.object({
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export type Timestamps = z.infer<typeof withTimestamps>
