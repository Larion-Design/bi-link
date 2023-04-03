import { Field, ObjectType } from '@nestjs/graphql'
import { UpdateSource } from 'defs'

@ObjectType()
export class ActivityEventAuthor implements UpdateSource {
  @Field()
  sourceId: string

  @Field(() => String)
  type: 'USER' | 'SERVICE'
}
