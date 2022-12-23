import { RelationshipMetadata } from '@app/definitions/entitiesGraph'

export interface PersonalRelationshipGraph extends RelationshipMetadata {
  type: string
  proximity: number
}
