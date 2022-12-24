import { Associate, RelationshipMetadata } from 'defs'

export interface AssociateGraphRelationship
  extends RelationshipMetadata,
    Required<Pick<Associate, 'role' | 'startDate' | 'endDate' | 'isActive' | 'equity'>> {}
