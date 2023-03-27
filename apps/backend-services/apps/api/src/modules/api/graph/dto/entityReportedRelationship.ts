import { ObjectType } from '@nestjs/graphql'
import { GraphRelationship } from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class EntityReportedRelationship implements NodesRelationship {
  _confirmed: boolean
  _type: GraphRelationship
  endNode: EntityInfo
  startNode: EntityInfo
  _trustworthiness: number
}
