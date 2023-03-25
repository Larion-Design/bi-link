import { Field, ObjectType } from '@nestjs/graphql'
import { NumberWithMetadata } from 'defs'
import { Metadata } from '../../metadata/dto/metadata'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType({ implements: () => [WithMetadata] })
export class NumberValue implements WithMetadata, NumberWithMetadata {
  metadata: Metadata

  @Field()
  value: number
}
