import { Field, ObjectType } from '@nestjs/graphql'
import { ActivityEvent as ActivityEventAPI } from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { ActivityEventAuthor } from './author'

@ObjectType()
export class ActivityEvent implements ActivityEventAPI {
  @Field()
  _id: string

  @Field(() => ActivityEventAuthor)
  author: ActivityEventAuthor

  @Field()
  eventType: string

  @Field(() => EntityInfo)
  targetEntityInfo: EntityInfo

  @Field()
  timestamp: number
}
