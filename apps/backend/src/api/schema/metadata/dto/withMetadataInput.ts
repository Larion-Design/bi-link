import { Field, InputType } from '@nestjs/graphql'
import { getDefaultMetadata } from 'default-values'
import { MetadataInput } from './metadataInput'

@InputType()
export class WithMetadataInput {
  @Field(() => MetadataInput, { defaultValue: getDefaultMetadata() })
  metadata: MetadataInput
}
