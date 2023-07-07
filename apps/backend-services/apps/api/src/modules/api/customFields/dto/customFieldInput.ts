import { Field, InputType, PickType } from '@nestjs/graphql'
import { CustomFieldAPI } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class CustomFieldInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements CustomFieldAPI
{
  @Field({ nullable: true })
  _id: string

  @Field()
  readonly fieldName: string

  @Field()
  readonly fieldValue: string
}
