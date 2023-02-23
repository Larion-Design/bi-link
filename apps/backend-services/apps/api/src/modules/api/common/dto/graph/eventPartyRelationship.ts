import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import { EventPartyRelationship as EventPartyRelationshipType, RelationshipLabel } from 'defs'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class EventPartyRelationship implements NodesRelationship, EventPartyRelationshipType {
  startNode: GraphNode
  endNode: GraphNode
  _confirmed: boolean
  _type: RelationshipLabel

  @Field()
  name: string
}
