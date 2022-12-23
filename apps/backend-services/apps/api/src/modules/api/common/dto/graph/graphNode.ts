import { Field, ObjectType } from '@nestjs/graphql'
import { EntityLabel, GraphNode as GraphNodeType } from '@app/definitions/entitiesGraph'

@ObjectType()
export class GraphNode implements GraphNodeType {
  @Field()
  _id: string

  @Field(() => String)
  _type: EntityLabel
}
