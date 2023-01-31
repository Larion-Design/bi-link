import { EntityType } from './index'

export interface ActivityEvent {
  _id: string
  timestamp: number
  eventType: string
  author?: string
  target: string
  targetType: EntityType
}

export type ActivityEventIndex = Omit<ActivityEvent, '_id'>
