import { Field, ObjectType } from '@nestjs/graphql'
import { DataRefAPI } from 'defs'
import { ConnectedEntity } from '../../../entityInfo/dto/connectedEntity'

@ObjectType()
export class DataRef implements DataRefAPI {
  @Field({ nullable: true })
  _id: string

  @Field(() => ConnectedEntity, { nullable: true })
  person?: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  company?: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  property?: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  event?: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  proceeding?: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  location?: ConnectedEntity

  @Field({ nullable: true })
  targetId?: string

  @Field({ nullable: true })
  path?: string

  @Field()
  field: string
}
