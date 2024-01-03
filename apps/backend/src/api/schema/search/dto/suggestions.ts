import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Suggestions {
  @Field(() => Int, { defaultValue: 0 })
  total: number
}
