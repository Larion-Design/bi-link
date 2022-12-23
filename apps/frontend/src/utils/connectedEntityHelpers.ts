import { ConnectedEntity } from '../types/connectedEntity'

export const getEntityId = ({ _id }: ConnectedEntity) => _id

export const findEntityIndex = (entityId: string, entities: ConnectedEntity[]) =>
  entities.findIndex(({ _id }) => entityId === _id)

export const getEntitiesIds = (entities: ConnectedEntity[]) => entities.map(getEntityId)

export const createConnectedEntities = (entitiesIds: string[]): ConnectedEntity[] =>
  entitiesIds.map((_id) => ({ _id }))
