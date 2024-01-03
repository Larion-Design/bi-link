import { Field, InputType } from '@nestjs/graphql'
import { MetadataInput } from './metadataInput'

@InputType()
export class WithMetadataInput {
  @Field(() => MetadataInput)
  metadata: MetadataInput
}
