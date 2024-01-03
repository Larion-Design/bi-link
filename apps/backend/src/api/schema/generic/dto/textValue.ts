import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { TextWithMetadata } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class TextValue
  extends PickType(WithMetadata, ['metadata'] as const)
  implements TextWithMetadata
{
  @Field()
  value: string
}
