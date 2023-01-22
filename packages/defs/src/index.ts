export * from './activityEvent'
export * from './associate'
export * from './company'
export * from './company'
export * from './customField'
export * from './connectedEntity'
export * from './entitiesGraph'
export * from './file'
export * from './incident'
export * from './idDocument'
export * from './location'
export * from './propertyOwner'
export * from './party'
export * from './person'
export * from './property'
export * from './relationship'
export * from './user'
export * from './reports'

export type EntityType = 'PERSON' | 'COMPANY' | 'PROPERTY' | 'INCIDENT' | 'REPORT' | 'FILE'

export type EntityInfo = {
  entityId: string
  entityType: EntityType
}
