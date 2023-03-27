import { Field, ObjectType } from '@nestjs/graphql'
import {
  GraphRelationship,
  ProceedingEntityRelationship as ProceedingEntityRelationshipType,
} from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class ProceedingEntityRelationship
  implements NodesRelationship, ProceedingEntityRelationshipType
{
  _confirmed: boolean
  _type: GraphRelationship
  endNode: EntityInfo
  startNode: EntityInfo
  _trustworthiness: number

  @Field()
  involvedAs: string
}
