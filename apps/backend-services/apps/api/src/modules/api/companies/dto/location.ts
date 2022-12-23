import { Field, ObjectType } from '@nestjs/graphql'
import { LocationAPIOutput } from '@app/definitions/location'

@ObjectType()
export class Location implements LocationAPIOutput {
  @Field()
  address: string

  @Field()
  isActive: boolean
}
