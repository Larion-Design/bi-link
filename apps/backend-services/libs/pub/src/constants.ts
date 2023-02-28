import { EntityType } from 'defs'

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
    entitiesRefresh: 'entitiesRefresh',
  },
  INDEXER: {
    id: 'INDEXER',
    indexEntity: 'indexEntity',
    entitiesRefresh: 'entitiesRefresh',
  },
  GRAPH: {
    id: 'GRAPH',
    entitiesRefresh: 'entitiesRefresh',
    entityCreated: 'entityCreated',
    entityModified: 'entityModified',
  },
}

export type EntityInfo = {
  entityId: string
  entityType: EntityType | 'FILE' | 'REPORT'
}
