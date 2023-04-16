import { EntityType } from 'defs'
import { boolean } from 'zod'

export type NodeTypes = 'personNode' | 'companyNode' | 'propertyNode' | 'eventNode' | 'locationNode'

export const nodeTypeToEntityType: Record<NodeTypes, EntityType> = {
  personNode: 'PERSON',
  companyNode: 'COMPANY',
  propertyNode: 'PROPERTY',
  eventNode: 'EVENT',
  locationNode: 'LOCATION',
}

export type CustomNodeProps = {
  label: string
  isRootNode?: boolean
}
