export interface ActivityEvent {
  _id: string
  timestamp: number
  eventType: string
  author?: string
  target: string
  targetType: string
}

export type ActivityEventIndex = Omit<ActivityEvent, '_id'>
