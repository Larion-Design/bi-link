import { Field, ObjectType } from '@nestjs/graphql'
import { DataRefAPI } from 'defs'
import { ConnectedEntity } from '../../../common/dto/connectedEntity'

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
  incident?: ConnectedEntity

  @Field({ nullable: true })
  targetId?: string

  @Field({ nullable: true })
  path?: string

  @Field()
  field: string
}
