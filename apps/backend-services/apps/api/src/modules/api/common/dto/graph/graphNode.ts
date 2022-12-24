import { Field, ObjectType } from '@nestjs/graphql'
import { EntityLabel, GraphNode as GraphNodeType } from 'defs'

@ObjectType()
export class GraphNode implements GraphNodeType {
  @Field()
  _id: string

  @Field(() => String)
  _type: EntityLabel
}
