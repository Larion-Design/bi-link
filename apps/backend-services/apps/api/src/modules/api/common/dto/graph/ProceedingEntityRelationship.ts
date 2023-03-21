import { Field, ObjectType } from '@nestjs/graphql'
import {
  ProceedingEntityRelationship as ProceedingEntityRelationshipType,
  RelationshipLabel,
} from 'defs'
import { GraphNode } from './graphNode'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class ProceedingEntityRelationship
  implements NodesRelationship, ProceedingEntityRelationshipType
{
  _confirmed: boolean
  _type: RelationshipLabel
  endNode: GraphNode
  startNode: GraphNode

  @Field()
  involvedAs: string
}
