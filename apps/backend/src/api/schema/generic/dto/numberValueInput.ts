import { Field, InputType, PickType } from '@nestjs/graphql'
import { NumberWithMetadata } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class NumberValueInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements NumberWithMetadata
{
  @Field()
  value: number
}
