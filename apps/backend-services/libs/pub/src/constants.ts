export const MICROSERVICES = {
  FILES_PARSER: {
    id: 'FILES_PARSER',
    extractText: 'extractText',
  },
  USER_ACTIONS_RECORDER: {
    id: 'USER_ACTIONS_RECORDER',
    recordUserAction: 'recordUserAction',
  },
  ENTITY_EVENTS: {
    id: 'ENTITY_EVENTS',
    entityCreated: 'entityCreated',
    entityModified: 'entityModified',
    graphEntityCreated: 'graphEntityCreated',
    graphEntityUpdated: 'graphEntityUpdated',
  },
  INDEXER: {
    indexEntity: 'indexEntity',
  },
}

export type EntityInfo = {
  entityId: string
  entityType: 'PERSON' | 'COMPANY' | 'INCIDENT' | 'FILE' | 'PROPERTY'
}
