import { Field, ObjectType } from '@nestjs/graphql'
import { ActivityEvent as ActivityEventType } from '@app/definitions/activityEvent'

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

  @Field()
  targetType: string
}
