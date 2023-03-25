import { Field, ObjectType } from '@nestjs/graphql'
import { DateWithMetadata } from 'defs'
import { Metadata } from '../../metadata/dto/metadata'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType({ implements: () => [WithMetadata] })
export class DateValue implements WithMetadata, DateWithMetadata {
  metadata: Metadata

  @Field()
  value: Date
}
