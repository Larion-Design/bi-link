import { CompanyAssociateRelationship } from '@app/definitions/associate'
import { IncidentPartyRelationship } from '@app/definitions/party'
import { PersonalRelationship } from '@app/definitions/relationship'
import { PropertyOwnerRelationship } from '@app/definitions/propertyOwner'

export interface GraphNode {
  _id: string
  _type: string
}

export interface EntitiesGraph {
  companiesAssociates: CompanyAssociateRelationship[]
  incidentsParties: IncidentPartyRelationship[]
  personalRelationships: PersonalRelationship[]
  propertiesRelationships: PropertyOwnerRelationship[]
}

export const enum RelationshipLabel {
  RELATED = 'RELATED',
  ASSOCIATE = 'ASSOCIATE',
  OWNER = 'OWNER',
  PARTY_INVOLVED = 'PARTY_INVOLVED',
  HAS_ATTACHMENT = 'HAS_ATTACHMENT',
}

export const enum EntityLabel {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
  INCIDENT = 'INCIDENT',
  FILE = 'FILE',
  PROPERTY = 'PROPERTY',
}

export type RelationshipMetadata = {
  _confirmed: boolean
}

export type EntityMetadata = { _id: string } & Record<
  string,
  number | string | Array<number | string>
>

export type NodeInfo = {
  _id: string
  _type: EntityLabel
}

export interface NodesRelationship {
  startNode: NodeInfo
  endNode: NodeInfo
  _confirmed: boolean
  _type: RelationshipLabel
}
