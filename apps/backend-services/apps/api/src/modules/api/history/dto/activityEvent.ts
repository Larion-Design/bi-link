import { Field, ObjectType } from '@nestjs/graphql'
import { ActivityEvent as ActivityEventAPI } from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'

@ObjectType()
export class ActivityEvent implements ActivityEventAPI {
  @Field()
  _id: string

  @Field({ nullable: true })
  author?: string

  @Field()
  eventType: string

  @Field(() => EntityInfo)
  targetEntityInfo: EntityInfo

  @Field()
  timestamp: number
}
