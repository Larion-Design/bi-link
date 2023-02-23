import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import { PropertyOwnerRelationship as PropertyOwnerRelationshipType, RelationshipLabel } from 'defs'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class PropertyOwnerRelationship implements NodesRelationship, PropertyOwnerRelationshipType {
  startNode: GraphNode
  endNode: GraphNode
  _confirmed: boolean
  _type: RelationshipLabel

  @Field({ nullable: true, defaultValue: null })
  startDate: Date | null

  @Field({ nullable: true, defaultValue: null })
  endDate: Date | null
}
