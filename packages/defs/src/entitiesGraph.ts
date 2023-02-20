import { CompanyAssociateRelationship } from './company'
import { IncidentPartyRelationship } from './event'
import { PersonalRelationship } from './person'
import { PropertyOwnerRelationship } from './property'

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

export enum RelationshipLabel {
  RELATED = 'RELATED',
  BORN_IN = 'BORN_IN',
  LIVES_AT = 'LIVES_AT',
  ASSOCIATE = 'ASSOCIATE',
  OWNER = 'OWNER',
  PARTY_INVOLVED = 'PARTY_INVOLVED',
  HAS_ATTACHMENT = 'HAS_ATTACHMENT',
  HQ_AT = 'HQ_AT',
  BRANCH_AT = 'BRANCH_AT',
  OCCURED_AT = 'OCCURED_AT',
  LOCATED_AT = 'LOCATED_AT',
}

export enum EntityLabel {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
  EVENT = 'EVENT',
  FILE = 'FILE',
  PROPERTY = 'PROPERTY',
  LOCATION = 'LOCATION',
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
