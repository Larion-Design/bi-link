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

  @Field({ nullable: true, defaultValue: null })
  startDate: Date | null

  @Field({ nullable: true, defaultValue: null })
  endDate: Date | null
}
