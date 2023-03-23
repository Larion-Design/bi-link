import { EntityType } from 'defs'

export type NodeTypes = 'personNode' | 'companyNode' | 'propertyNode' | 'eventNode' | 'locationNode'

export const nodeTypeToEntityType: Record<NodeTypes, EntityType> = {
  personNode: 'PERSON',
  companyNode: 'COMPANY',
  propertyNode: 'PROPERTY',
  eventNode: 'EVENT',
  locationNode: 'LOCATION',
}
