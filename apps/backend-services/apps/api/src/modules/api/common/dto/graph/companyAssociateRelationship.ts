import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import {
  CompanyAssociateRelationship as CompanyAssociateRelationshipType,
  RelationshipLabel,
} from 'defs'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class CompanyAssociateRelationship
  implements NodesRelationship, CompanyAssociateRelationshipType
{
  startNode: GraphNode
  endNode: GraphNode
  _type: RelationshipLabel
  _confirmed: boolean

  @Field()
  role: string

  @Field({ nullable: true, defaultValue: 0 })
  equity: number
}
