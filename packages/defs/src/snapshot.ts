import { User } from './user'

export interface Snapshot<T> {
  _id: string
  user?: User
  service?: string
  dateCreated: Date
  entityId: string
  entityInfo: T
}
