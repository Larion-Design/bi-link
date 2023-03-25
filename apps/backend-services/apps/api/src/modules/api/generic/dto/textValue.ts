import { Field, ObjectType } from '@nestjs/graphql'
import { TextWithMetadata } from 'defs'
import { Metadata } from '../../metadata/dto/metadata'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType({ implements: () => [WithMetadata] })
export class TextValue implements WithMetadata, TextWithMetadata {
  metadata: Metadata

  @Field()
  value: string
}
