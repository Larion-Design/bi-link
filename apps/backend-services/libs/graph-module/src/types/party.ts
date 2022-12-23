import { Party } from '@app/definitions/party'
import { RelationshipMetadata } from '@app/definitions/entitiesGraph'

export interface PartyGraphRelationship extends RelationshipMetadata, Pick<Party, 'name'> {}
