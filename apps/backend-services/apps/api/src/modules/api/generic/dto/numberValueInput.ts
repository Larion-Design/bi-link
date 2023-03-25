import { Field, InputType } from '@nestjs/graphql'
import { NumberWithMetadata } from 'defs'
import { MetadataInput } from '../../metadata/dto/metadataInput'

@InputType()
export class NumberValueInput implements NumberWithMetadata {
  @Field(() => MetadataInput)
  metadata: MetadataInput

  @Field()
  value: number
}
