import { Field, ObjectType } from '@nestjs/graphql'
import { User as UserType, UserRole } from 'defs'

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

  @Field(() => String)
  role: UserRole
}
