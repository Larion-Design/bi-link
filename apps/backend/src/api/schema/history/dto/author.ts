import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ActivityEventAuthor {
  @Field()
  sourceId: string

  @Field(() => String)
  type: 'USER' | 'SERVICE'
}
