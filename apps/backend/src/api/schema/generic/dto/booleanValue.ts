import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { BooleanWithMetadata } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class BooleanValue
  extends PickType(WithMetadata, ['metadata'] as const)
  implements BooleanWithMetadata
{
  @Field()
  value: boolean
}
