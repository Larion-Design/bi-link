import { Field, ObjectType } from '@nestjs/graphql'
import { OSINTPerson as OSINTPersonType } from 'defs'

@ObjectType()
export class OSINTPerson implements OSINTPersonType {
  @Field()
  id: string

  @Field()
  url: string

  @Field()
  name: string

  @Field({ nullable: true })
  address: string
}
