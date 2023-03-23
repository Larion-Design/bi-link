import { Field, InterfaceType } from '@nestjs/graphql'
import { RelationshipLabel } from 'defs'
import { GraphNode } from './graphNode'

@InterfaceType()
export abstract class NodesRelationship {
  @Field(() => GraphNode)
  startNode: GraphNode

  @Field(() => GraphNode)
  endNode: GraphNode

  @Field(() => String)
  _type: RelationshipLabel

  @Field()
  _confirmed: boolean
}
