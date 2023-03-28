export const MICROSERVICES = {
  INGRESS: {
    id: 'INGRESS',
    persons: {
      getPerson: 'getPerson',
      getPersonSnapshot: 'getPersonSnapshot',
      getPersonSnapshots: 'getPersonSnapshots',
      getAllPersonSnapshots: 'getAllPersonSnapshots',
      createPersonPendingSnapshot: 'createPersonPendingSnapshot',
      createPersonHistorySnapshot: 'createPersonHistorySnapshot',
      applyPersonSnapshot: 'applyPersonSnapshot',
      getPersons: 'getPersons',
      createPerson: 'createPerson',
      updatePerson: 'updatePerson',
    },
    companies: {
      getCompany: 'getCompany',
      getCompanies: 'getCompanies',
      createCompany: 'createCompany',
      updateCompany: 'updateCompany',
      getCompanySnapshot: 'getCompanySnapshot',
    },
  },
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
    createMapping: 'createMapping',
    recordHistoryEvent: 'addHistoryEvent',
  },
  GRAPH: {
    id: 'GRAPH',
    entitiesRefresh: 'entitiesRefresh',
    entityCreated: 'entityCreated',
    entityModified: 'entityModified',
  },
}
