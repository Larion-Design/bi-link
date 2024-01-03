import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { NumberWithMetadata } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class NumberValue
  extends PickType(WithMetadata, ['metadata'] as const)
  implements NumberWithMetadata
{
  @Field()
  value: number
}
