import { Field, InterfaceType } from '@nestjs/graphql'
import { GraphRelationship } from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { NodesRelationship as NodesRelationshipType } from 'defs'

@InterfaceType()
export abstract class NodesRelationship implements NodesRelationshipType {
  @Field(() => EntityInfo)
  startNode: EntityInfo

  @Field(() => EntityInfo)
  endNode: EntityInfo

  @Field(() => String)
  _type: GraphRelationship

  @Field()
  _confirmed: boolean

  @Field()
  _trustworthiness: number
}
