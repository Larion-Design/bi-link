import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { OptionalDateWithMetadata } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class OptionalDateValue
  extends PickType(WithMetadata, ['metadata'] as const)
  implements OptionalDateWithMetadata
{
  @Field(() => Date, { nullable: true })
  value?: Date | null
}
