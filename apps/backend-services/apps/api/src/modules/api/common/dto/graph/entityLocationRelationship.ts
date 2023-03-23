import { Field, ObjectType } from '@nestjs/graphql'
import {
  EntityLocationRelationship as EntityLocationRelationshipType,
  RelationshipLabel,
} from 'defs'
import { GraphNode } from './graphNode'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class EntityLocationRelationship
  implements EntityLocationRelationshipType, NodesRelationship
{
  startNode: GraphNode
  endNode: GraphNode
  _type: RelationshipLabel
  _confirmed: boolean
}
