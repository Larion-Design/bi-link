import { Field, ObjectType } from '@nestjs/graphql'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { GraphRelationship, PersonalRelationship as PersonalRelationshipType } from 'defs'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class PersonalRelationship implements NodesRelationship, PersonalRelationshipType {
  startNode: EntityInfo
  endNode: EntityInfo
  _confirmed: boolean
  _type: GraphRelationship
  _trustworthiness: number

  @Field()
  type: string

  @Field()
  proximity: number
}
