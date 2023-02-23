import { Field, ObjectType } from '@nestjs/graphql'
import { EntitiesGraph as EntitiesGraphType } from 'defs'
import { CompanyAssociateRelationship } from './companyAssociateRelationship'
import { EntityLocationRelationship } from './entityLocationRelationship'
import { EventPartyRelationship } from './eventPartyRelationship'
import { PersonalRelationship } from './personalRelationship'
import { PropertyOwnerRelationship } from './propertyOwnerRelationship'

@ObjectType()
export class EntitiesGraph implements EntitiesGraphType {
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
}
