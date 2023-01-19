import { Field, ObjectType } from '@nestjs/graphql'
import { DataRefAPI } from 'defs'
import { ConnectedEntity } from '../../../common/dto/connectedEntity'
import { EntityInfoField } from './entityInfoField'
import { RelationshipInfoField } from './relationshipInfoField'

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

  @Field(() => EntityInfoField, { nullable: true })
  entityInfo?: EntityInfoField

  @Field(() => RelationshipInfoField, { nullable: true })
  relationshipInfo?: RelationshipInfoField
}
