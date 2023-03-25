import { Field, ObjectType } from '@nestjs/graphql'
import {
  CompanyAssociateRelationship as CompanyAssociateRelationshipType,
  GraphRelationship,
} from 'defs'
import { EntityInfo } from '../../entityInfo/dto/entityInfo'
import { NodesRelationship } from './nodesRelationship'

@ObjectType({ implements: () => [NodesRelationship] })
export class CompanyAssociateRelationship
  implements NodesRelationship, CompanyAssociateRelationshipType
{
  startNode: EntityInfo
  endNode: EntityInfo
  _type: GraphRelationship
  _confirmed: boolean

  @Field()
  role: string

  @Field({ nullable: true, defaultValue: 0 })
  equity: number
}
