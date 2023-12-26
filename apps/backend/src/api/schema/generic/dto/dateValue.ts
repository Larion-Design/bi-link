import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { DateWithMetadata } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class DateValue
  extends PickType(WithMetadata, ['metadata'] as const)
  implements DateWithMetadata
{
  @Field()
  value: Date
}
