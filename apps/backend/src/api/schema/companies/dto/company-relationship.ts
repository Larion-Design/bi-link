import { Field, ObjectType, PickType } from '@nestjs/graphql'
import {
  CompanyRelationship as CompanyRelationshipType,
  CompanyRelationshipType as RelationshipType,
} from 'defs'
import { CustomField } from '@modules/api/schema/customFields/dto/customField'
import { ConnectedEntity } from '@modules/api/schema/entityInfo/dto/connectedEntity'
import { WithMetadata } from '@modules/api/schema/metadata/dto/withMetadata'

@ObjectType()
export class CompanyRelationship
  extends PickType(WithMetadata, ['metadata'] as const)
  implements CompanyRelationshipType
{
  @Field(() => ConnectedEntity, { nullable: true })
  company?: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  person?: ConnectedEntity

  @Field(() => String)
  type: RelationshipType

  @Field(() => [CustomField])
  customFields: CustomField[]
}
