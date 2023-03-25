import { Field, InputType } from '@nestjs/graphql'
import { Metadata as MetadataAPI } from 'defs'
import { Trustworthiness } from './trustworthiness'

@InputType()
export class MetadataInput implements MetadataAPI {
  @Field()
  access: string

  @Field()
  confirmed: boolean

  @Field(() => Trustworthiness)
  trustworthiness: Trustworthiness
}
