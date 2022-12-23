import { Associate } from '@app/definitions/associate'
import { RelationshipMetadata } from '@app/definitions/entitiesGraph'

export interface AssociateGraphRelationship
  extends RelationshipMetadata,
    Required<Pick<Associate, 'role' | 'startDate' | 'endDate' | 'isActive' | 'equity'>> {}
