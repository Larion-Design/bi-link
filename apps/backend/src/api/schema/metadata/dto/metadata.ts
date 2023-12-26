import { Field, ObjectType } from '@nestjs/graphql'
import { Metadata as MetadataAPI } from 'defs'
import { Trustworthiness } from './trustworthiness'

@ObjectType()
export class Metadata implements MetadataAPI {
  @Field()
  access: string

  @Field()
  confirmed: boolean

  @Field(() => Trustworthiness)
  trustworthiness: Trustworthiness
}
