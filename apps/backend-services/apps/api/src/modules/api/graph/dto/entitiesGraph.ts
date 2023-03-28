import { Field, ObjectType } from '@nestjs/graphql'
import {
  Graph,
  GraphRelationships as GraphRelationshipsType,
  GraphEntities as GraphEntitiesType,
} from 'defs'
import { CompanyListRecord } from '../../companies/dto/companyListRecord'
import { EventListRecord } from '../../events/dto/eventListRecord'
import { Person } from '../../persons/dto/person'
import { ProceedingListRecord } from '../../proceedings/dto/proceedingListRecord'
import { PropertyListRecord } from '../../properties/dto/propertyListRecord'
import { ReportListRecord } from '../../reports/dto/reportListRecord'
import { Location } from '../../geolocation/dto/location'
import { CompanyAssociateRelationship } from './companyAssociateRelationship'
import { EntityLocationRelationship } from './entityLocationRelationship'
import { EntityReportedRelationship } from './entityReportedRelationship'
import { EventPartyRelationship } from './eventPartyRelationship'
import { PersonalRelationship } from './personalRelationship'
import { ProceedingEntityRelationship } from './ProceedingEntityRelationship'
import { PropertyOwnerRelationship } from './propertyOwnerRelationship'

@ObjectType()
export class GraphRelationships implements GraphRelationshipsType {
  @Field(() => [EventPartyRelationship])
  eventsParties: EventPartyRelationship[]

  @Field(() => [EntityLocationRelationship])
  propertiesLocation: EntityLocationRelationship[]

  @Field(() => [EntityLocationRelationship])
  companiesHeadquarters: EntityLocationRelationship[]

  @Field(() => [EntityLocationRelationship])
  companiesBranches: EntityLocationRelationship[]

  @Field(() => [EntityLocationRelationship])
  personsBirthPlace: EntityLocationRelationship[]

  @Field(() => [EntityLocationRelationship])
  personsHomeAddress: EntityLocationRelationship[]

  @Field(() => [EntityLocationRelationship])
  eventsOccurrencePlace: EntityLocationRelationship[]

  @Field(() => [CompanyAssociateRelationship])
  companiesAssociates: CompanyAssociateRelationship[]

  @Field(() => [PropertyOwnerRelationship])
  propertiesRelationships: PropertyOwnerRelationship[]

  @Field(() => [PersonalRelationship])
  personalRelationships: PersonalRelationship[]

  @Field(() => [EntityReportedRelationship])
  entitiesReported: EntityReportedRelationship[]

  @Field(() => [ProceedingEntityRelationship])
  entitiesInvolvedInProceeding: ProceedingEntityRelationship[]
}

@ObjectType()
export class GraphEntities implements GraphEntitiesType {
  @Field(() => [CompanyListRecord])
  companies: CompanyListRecord[]

  @Field(() => [EventListRecord])
  events: EventListRecord[]

  @Field(() => [Location])
  locations: Location[]

  @Field(() => [Person])
  persons: Person[]

  @Field(() => [PropertyListRecord])
  properties: PropertyListRecord[]

  @Field(() => [ReportListRecord])
  reports: ReportListRecord[]

  @Field(() => [ProceedingListRecord])
  proceedings: ProceedingListRecord[]
}

@ObjectType()
export class EntitiesGraph implements Graph {
  @Field(() => GraphRelationships)
  relationships: GraphRelationships

  @Field(() => GraphEntities)
  entities: GraphEntities
}