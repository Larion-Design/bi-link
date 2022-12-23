export interface User {
  _id: string
  email: string
  name: string
  role: string
  active: boolean
}

export const UserActions = {
  ENTITY_CREATED: 'ENTITY_CREATED',
  ENTITY_UPDATED: 'ENTITY_UPDATED',
}
