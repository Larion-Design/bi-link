import { ObjectType } from '@nestjs/graphql'
import { RelationshipLabel } from 'defs'
import { GraphNode } from './graphNode'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class EntityReportedRelationship implements NodesRelationship {
  _confirmed: boolean
  _type: RelationshipLabel
  endNode: GraphNode
  startNode: GraphNode
}
