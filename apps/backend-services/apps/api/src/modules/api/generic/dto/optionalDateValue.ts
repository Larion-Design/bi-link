import { Field, ObjectType } from '@nestjs/graphql'
import { OptionalDateWithMetadata } from 'defs'
import { Metadata } from '../../metadata/dto/metadata'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType({ implements: () => [WithMetadata] })
export class OptionalDateValue implements WithMetadata, OptionalDateWithMetadata {
  metadata: Metadata

  @Field({ nullable: true })
  value: Date
}
