import { Field, ObjectType } from '@nestjs/graphql'
import { LocationAPIOutput } from 'defs'

@ObjectType()
export class Location implements LocationAPIOutput {
  @Field()
  address: string

  @Field()
  isActive: boolean
}
