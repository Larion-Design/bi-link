import { Field, InputType } from '@nestjs/graphql'
import { Metadata as MetadataAPI } from 'defs'
import { TrustworthinessInput } from './trustworthinessInput'

@InputType()
export class MetadataInput implements MetadataAPI {
  @Field()
  access: string

  @Field()
  confirmed: boolean

  @Field(() => TrustworthinessInput)
  trustworthiness: TrustworthinessInput
}
