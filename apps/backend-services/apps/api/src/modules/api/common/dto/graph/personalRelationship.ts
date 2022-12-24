import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import { PersonalRelationship as PersonalRelationshipType, RelationshipLabel } from 'defs'

@ObjectType()
export class PersonalRelationship implements PersonalRelationshipType {
  @Field(() => GraphNode)
  startNode: GraphNode

  @Field(() => GraphNode)
  endNode: GraphNode

  @Field()
  type: string

  @Field()
  _confirmed: boolean

  @Field(() => String)
  _type: RelationshipLabel
}
