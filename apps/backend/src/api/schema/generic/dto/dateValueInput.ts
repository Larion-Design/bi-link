import { Field, InputType, PickType } from '@nestjs/graphql'
import { OptionalDateWithMetadata } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class DateValueInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements OptionalDateWithMetadata
{
  @Field()
  value: Date
}
