export * from './activityEvent'
export * from './customField'
export * from './connectedEntity'
export * from './graphRelationships'
export * from './file'
export * from './geolocation'
export * from './property'
export * from './user'
export * from './reports'
export * from './person'
export * from './company'
export * from './event'
export * from './metadata'
export * from './model'
export * from './proceeding'
export * from './searchSuggestions'
export * from './snapshot'

export type EntityType =
  | 'PERSON'
  | 'COMPANY'
  | 'PROPERTY'
  | 'EVENT'
  | 'REPORT'
  | 'FILE'
  | 'LOCATION'
  | 'PROCEEDING'

export type EntityInfo = {
  entityId: string
  entityType: EntityType
}
