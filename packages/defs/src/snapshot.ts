import { User } from './user'

export interface Snapshot<T> {
  author: User
  dateCreated: Date
  entityInfo: T
}
