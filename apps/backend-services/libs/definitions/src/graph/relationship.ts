import { RelationshipMetadata } from 'defs'

export interface PersonalRelationshipGraph extends RelationshipMetadata {
  type: string
  proximity: number
}
