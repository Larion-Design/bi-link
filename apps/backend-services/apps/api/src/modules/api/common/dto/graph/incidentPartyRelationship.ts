import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import { IncidentPartyRelationship as IncidentPartyRelationshipType } from '@app/definitions/party'
import { RelationshipLabel } from '@app/definitions/entitiesGraph'

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
