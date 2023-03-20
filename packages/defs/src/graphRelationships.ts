import { CompanyAssociateRelationship, CompanyListRecord } from './company'
import { EventListRecord, EventPartyRelationship } from './event'
import { EntityLocationRelationship, LocationAPIOutput } from './geolocation'
import { PersonalRelationship, PersonListRecordWithImage } from './person'
import { ProceedingAPIOutput, ProceedingEntityRelationship } from './proceeding'
import { PropertyListRecord, PropertyOwnerRelationship } from './property'
import { ReportAPIOutput, ReportedEntityRelationship } from './reports'

export interface GraphNode {
  _id: string
  _type: EntityLabel
}

export interface GraphRelationships {
  companiesAssociates: CompanyAssociateRelationship[]
  eventsParties: EventPartyRelationship[]
  personalRelationships: PersonalRelationship[]
  propertiesRelationships: PropertyOwnerRelationship[]
  propertiesLocation: EntityLocationRelationship[]
  companiesHeadquarters: EntityLocationRelationship[]
  companiesBranches: EntityLocationRelationship[]
  personsBirthPlace: EntityLocationRelationship[]
  personsHomeAddress: EntityLocationRelationship[]
  eventsOccurrencePlace: EntityLocationRelationship[]
  entitiesReported: ReportedEntityRelationship[]
  entitiesInvolvedInProceeding: ProceedingEntityRelationship[]
}

export interface GraphEntities {
  companies: CompanyListRecord[]
  persons: PersonListRecordWithImage[]
  properties: PropertyListRecord[]
  events: EventListRecord[]
  locations: LocationAPIOutput[]
  proceedings: ProceedingAPIOutput[]
  reports: ReportAPIOutput[]
}

export interface Graph {
  relationships: GraphRelationships
  entities: GraphEntities
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
  INVOLVED_AS = 'INVOLVED_AS',
  REPORTED = 'REPORTED',
  MENTIONED = 'MENTIONED',
}

export enum EntityLabel {
  PERSON = 'PERSON',
  COMPANY = 'COMPANY',
  EVENT = 'EVENT',
  FILE = 'FILE',
  PROPERTY = 'PROPERTY',
  LOCATION = 'LOCATION',
  PROCEEDING = 'PROCEEDING',
  REPORT = 'REPORT',
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
  startNode: GraphNode
  endNode: GraphNode
  _confirmed: boolean
  _type: RelationshipLabel
}
