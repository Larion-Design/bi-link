import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import { PersonalRelationship as PersonalRelationshipType, RelationshipLabel } from 'defs'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class PersonalRelationship implements NodesRelationship, PersonalRelationshipType {
  startNode: GraphNode
  endNode: GraphNode
  _confirmed: boolean
  _type: RelationshipLabel

  @Field()
  type: string
}
