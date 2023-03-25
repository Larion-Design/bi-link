import { Field, InterfaceType } from '@nestjs/graphql'
import { GraphRelationship } from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'

@InterfaceType()
export abstract class NodesRelationship {
  @Field(() => EntityInfo)
  startNode: EntityInfo

  @Field(() => EntityInfo)
  endNode: EntityInfo

  @Field(() => String)
  _type: GraphRelationship

  @Field()
  _confirmed: boolean
}
