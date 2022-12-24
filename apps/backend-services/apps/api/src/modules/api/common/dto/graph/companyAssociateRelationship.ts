import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import {
  CompanyAssociateRelationship as CompanyAssociateRelationshipType,
  RelationshipLabel,
} from 'defs'

@ObjectType()
export class CompanyAssociateRelationship implements CompanyAssociateRelationshipType {
  @Field(() => GraphNode)
  startNode: GraphNode

  @Field(() => GraphNode)
  endNode: GraphNode

  @Field()
  role: string

  @Field()
  _confirmed: boolean

  @Field({ nullable: true, defaultValue: 0 })
  equity: number

  @Field(() => String)
  _type: RelationshipLabel
}
