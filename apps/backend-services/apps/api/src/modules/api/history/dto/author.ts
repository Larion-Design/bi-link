import { Field, ObjectType } from '@nestjs/graphql'
import { UpdateSource } from 'defs'

@ObjectType()
export class ActivityEventAuthor {
  @Field()
  sourceId: string

  @Field(() => String)
  type: 'USER' | 'SERVICE'
}
