import { Field, ObjectType } from '@nestjs/graphql'
import { User as UserType } from '@app/definitions/user'

@ObjectType()
export class User implements UserType {
  @Field()
  _id: string

  @Field()
  email: string

  @Field()
  name: string

  @Field()
  active: boolean

  @Field()
  role: string
}
