import { RelationshipMetadata } from 'defs'

export interface PropertyOwnerGraphRelationship extends RelationshipMetadata {
  startDate?: Date | string
  endDate?: Date | string
  plateNumber?: string
}
