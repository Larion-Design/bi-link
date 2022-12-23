import { Field, ObjectType } from '@nestjs/graphql'
import { CompanyAssociateRelationship } from './companyAssociateRelationship'
import { IncidentPartyRelationship } from './incidentPartyRelationship'
import { PersonalRelationship } from './personalRelationship'
import { PropertyOwnerRelationship } from './propertyOwnerRelationship'

@ObjectType()
export class EntitiesGraph {
  @Field(() => [CompanyAssociateRelationship])
  companiesAssociates: CompanyAssociateRelationship[]

  @Field(() => [IncidentPartyRelationship])
  incidentsParties: IncidentPartyRelationship[]

  @Field(() => [PropertyOwnerRelationship])
  propertiesRelationships: PropertyOwnerRelationship[]

  @Field(() => [PersonalRelationship])
  personalRelationships: PersonalRelationship[]
}
