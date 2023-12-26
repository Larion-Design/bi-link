import { Field, InputType, PickType } from '@nestjs/graphql'
import { BooleanWithMetadata } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class BooleanValueInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements BooleanWithMetadata
{
  @Field()
  value: boolean
}
