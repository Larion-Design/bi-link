import { z } from 'zod'

export const userRoleSchema = z.enum(['ADMIN', 'OPERATOR', 'CI', 'DEV'])

export const userSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: userRoleSchema,
  active: z.boolean(),
})

export type UserRole = z.infer<typeof userRoleSchema>
export type User = z.infer<typeof userSchema>
export type UserAPI = User
