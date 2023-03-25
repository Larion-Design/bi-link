import { z } from 'zod'

export const connectedEntitySchema = z.object({
  _id: z.string().uuid(),
})

export type ConnectedEntity = z.infer<typeof connectedEntitySchema>
