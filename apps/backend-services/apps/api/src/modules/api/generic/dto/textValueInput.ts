import { Field, ObjectType } from '@nestjs/graphql'
import { TextWithMetadata } from 'defs'
import { MetadataInput } from '../../metadata/dto/metadataInput'

@ObjectType()
export class TextValueInput implements TextWithMetadata {
  @Field(() => MetadataInput)
  metadata: MetadataInput

  @Field()
  value: string
}
