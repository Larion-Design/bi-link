import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { TextWithMetadata } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@ObjectType()
export class TextValueInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements TextWithMetadata
{
  @Field()
  value: string
}
