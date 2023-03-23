import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { EventListRecord as EventListRecordType } from 'defs'
import { Event } from './event'

@ObjectType()
export class EventListRecord
  extends PickType(Event, ['_id', 'type', 'date'])
  implements EventListRecordType
{
  @Field()
  location: string
}
