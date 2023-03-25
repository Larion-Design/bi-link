import { z } from 'zod'

export const userSchema = z.object({
  _id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.string(),
  active: z.boolean(),
})

export type User = z.infer<typeof userSchema>
export type UserAPI = User

export const UserActions = {
  ENTITY_CREATED: 'ENTITY_CREATED',
  ENTITY_UPDATED: 'ENTITY_UPDATED',
}

export enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  CI = 'CI',
  DEV = 'DEV',
}
