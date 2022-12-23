import { Field, ObjectType } from '@nestjs/graphql'
import { GraphNode } from './graphNode'
import { PropertyOwnerRelationship as PropertyOwnerRelationshipType } from '@app/definitions/propertyOwner'
import { RelationshipLabel } from '@app/definitions/entitiesGraph'

@ObjectType()
export class PropertyOwnerRelationship implements PropertyOwnerRelationshipType {
  @Field(() => GraphNode)
  startNode: GraphNode

  @Field(() => GraphNode)
  endNode: GraphNode

  @Field({ nullable: true, defaultValue: null })
  startDate: Date | null

  @Field({ nullable: true, defaultValue: null })
  endDate: Date | null

  @Field()
  _confirmed: boolean

  @Field(() => String)
  _type: RelationshipLabel
}
