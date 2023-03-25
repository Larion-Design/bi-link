import { Field, InputType } from '@nestjs/graphql'
import { OptionalDateWithMetadata } from 'defs'
import { MetadataInput } from '../../metadata/dto/metadataInput'

@InputType()
export class DateValueInput implements OptionalDateWithMetadata {
  @Field(() => MetadataInput)
  metadata: MetadataInput

  @Field()
  value: Date
}
