import { Field, InputType, PickType } from '@nestjs/graphql'
import { CustomFieldInput } from '@modules/api/schema/customFields/dto/customFieldInput'
import { ConnectedEntityInput } from '@modules/api/schema/entityInfo/dto/connectedEntityInput'
import { WithMetadataInput } from '@modules/api/schema/metadata/dto/withMetadataInput'
import {
  CompanyRelationship as CompanyRelationshipType,
  CompanyRelationshipType as RelationshipType,
} from 'defs'

@InputType()
export class CompanyRelationshipInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements CompanyRelationshipType
{
  @Field(() => ConnectedEntityInput, { nullable: true })
  company?: ConnectedEntityInput

  @Field(() => ConnectedEntityInput, { nullable: true })
  person?: ConnectedEntityInput

  @Field(() => String)
  type: RelationshipType

  @Field(() => [CustomFieldInput])
  customFields: CustomFieldInput[]
}
