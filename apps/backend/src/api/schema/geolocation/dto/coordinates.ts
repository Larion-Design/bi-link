import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Coordinates {
  @Field({ nullable: true, defaultValue: 0 })
  lat: number

  @Field({ nullable: true, defaultValue: 0 })
  long: number
}
