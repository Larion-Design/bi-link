import { ObjectType } from '@nestjs/graphql'
import {
  EntityLocationRelationship as EntityLocationRelationshipType,
  GraphRelationship,
} from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class EntityLocationRelationship
  implements EntityLocationRelationshipType, NodesRelationship
{
  startNode: EntityInfo
  endNode: EntityInfo
  _type: GraphRelationship
  _confirmed: boolean
}
