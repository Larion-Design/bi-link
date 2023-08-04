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

export type ETLStages = 'EXTRACT' | 'TRANSFORM' | 'LOAD'

export type TaskProgress<T = ETLStages> = {
  stage: T
}
