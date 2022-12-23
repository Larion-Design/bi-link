import { RelationshipMetadata } from '@app/definitions/entitiesGraph'

export interface PropertyOwnerGraphRelationship extends RelationshipMetadata {
  startDate?: Date | string
  endDate?: Date | string
  plateNumber?: string
}
