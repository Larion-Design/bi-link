import { Field, ObjectType } from '@nestjs/graphql'
import { ActivityEvent as ActivityEventType, EntityType } from 'defs'

@ObjectType()
export class ActivityEvent implements ActivityEventType {
  @Field()
  _id: string

  @Field()
  timestamp: number

  @Field()
  eventType: string

  @Field({ nullable: true })
  author?: string

  @Field()
  target: string

  @Field(() => String)
  targetType: EntityType
}
