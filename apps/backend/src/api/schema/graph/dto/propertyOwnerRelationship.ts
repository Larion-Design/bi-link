import { Field, ObjectType } from '@nestjs/graphql'
import { GraphRelationship, PropertyOwnerRelationship as PropertyOwnerRelationshipType } from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class PropertyOwnerRelationship implements NodesRelationship, PropertyOwnerRelationshipType {
  startNode: EntityInfo
  endNode: EntityInfo
  _confirmed: boolean
  _type: GraphRelationship
  _trustworthiness: number

  @Field(() => Date, { nullable: true })
  startDate: Date | null

  @Field(() => Date, { nullable: true })
  endDate: Date | null
}
