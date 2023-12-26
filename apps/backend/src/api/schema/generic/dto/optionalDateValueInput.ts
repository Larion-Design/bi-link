import { Field, InputType, PickType } from '@nestjs/graphql'
import { OptionalDateWithMetadata } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class OptionalDateValueInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements OptionalDateWithMetadata
{
  @Field(() => Date, { nullable: true })
  value: Date | null
}
