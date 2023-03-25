import { Field, ObjectType } from '@nestjs/graphql'
import { EventParticipantRelationship, GraphRelationship } from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class EventPartyRelationship implements NodesRelationship, EventParticipantRelationship {
  startNode: EntityInfo
  endNode: EntityInfo
  _confirmed: boolean
  _type: GraphRelationship

  @Field()
  name: string
}
