export interface User {
  _id: string
  email: string
  name: string
  role: string
  active: boolean
}

export interface UserAPI extends User {}

export const UserActions = {
  ENTITY_CREATED: 'ENTITY_CREATED',
  ENTITY_UPDATED: 'ENTITY_UPDATED',
}

export const enum Role {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  CI = 'CI',
  DEV = 'DEV',
}
