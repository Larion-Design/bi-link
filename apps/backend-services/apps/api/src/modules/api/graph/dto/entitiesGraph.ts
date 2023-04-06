import { Field, ObjectType } from '@nestjs/graphql'
import {
  Graph,
  GraphRelationships as GraphRelationshipsType,
  GraphEntities as GraphEntitiesType,
} from 'defs'
import { Company } from '../../companies/dto/company'
import { Event } from '../../events/dto/event'
import { Person } from '../../persons/dto/person'
import { Proceeding } from '../../proceedings/dto/proceeding'
import { Property } from '../../properties/dto/property'
import { Report } from '../../reports/dto/report'
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
  @Field(() => [Company])
  companies: Company[]

  @Field(() => [Event])
  events: Event[]

  @Field(() => [Location])
  locations: Location[]

  @Field(() => [Person])
  persons: Person[]

  @Field(() => [Property])
  properties: Property[]

  @Field(() => [Report])
  reports: Report[]

  @Field(() => [Proceeding])
  proceedings: Proceeding[]
}

@ObjectType()
export class EntitiesGraph implements Graph {
  @Field(() => GraphRelationships)
  relationships: GraphRelationships

  @Field(() => GraphEntities)
  entities: GraphEntities
}
