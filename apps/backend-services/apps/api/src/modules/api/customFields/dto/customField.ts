import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { CustomFieldAPI } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class CustomField
  extends PickType(WithMetadata, ['metadata'] as const)
  implements CustomFieldAPI
{
  @Field({ nullable: true })
  _id: string

  @Field()
  fieldName: string

  @Field()
  fieldValue: string
}
