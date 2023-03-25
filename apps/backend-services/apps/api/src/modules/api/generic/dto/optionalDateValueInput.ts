import { Field, InputType } from '@nestjs/graphql'
import { OptionalDateWithMetadata } from 'defs'
import { MetadataInput } from '../../metadata/dto/metadataInput'

@InputType()
export class OptionalDateValueInput implements OptionalDateWithMetadata {
  @Field(() => MetadataInput)
  metadata: MetadataInput

  @Field({ nullable: true })
  value: Date
}
