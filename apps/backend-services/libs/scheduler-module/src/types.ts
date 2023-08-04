import { EntityInfo } from 'defs'

export type EntityEventInfo = {
  entityId: string
}

export type FileEventInfo = {
  linkedEntity?: EntityInfo
  fileId: string
}

export type ParentTask = {
  queue: string
  id: string
}

export type TaskProgress<T = string> = {
  stage: T
}
