import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import { IncidentPartyRelationship as IncidentPartyRelationshipType, RelationshipLabel } from 'defs'

@ObjectType()
export class IncidentPartyRelationship implements IncidentPartyRelationshipType {
  @Field(() => GraphNode)
  startNode: GraphNode

  @Field(() => GraphNode)
  endNode: GraphNode

  @Field()
  _confirmed: boolean

  @Field()
  name: string

  @Field(() => String)
  _type: RelationshipLabel
}
