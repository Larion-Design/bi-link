import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CoordinatesInput {
  @Field({ nullable: true, defaultValue: 0 })
  lat: number

  @Field({ nullable: true, defaultValue: 0 })
  long: number
}
