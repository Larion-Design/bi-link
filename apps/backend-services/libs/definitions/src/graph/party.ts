import { Party, RelationshipMetadata } from 'defs'

export interface PartyGraphRelationship extends RelationshipMetadata, Pick<Party, 'name'> {}
