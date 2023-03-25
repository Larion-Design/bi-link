import { Field, ObjectType } from '@nestjs/graphql'
import { ProceedingEntityInvolvedAPI } from 'defs'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'

@ObjectType()
export class ProceedingEntity implements ProceedingEntityInvolvedAPI {
  @Field(() => ConnectedEntity, { nullable: true })
  person: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  company?: ConnectedEntity

  @Field()
  description: string

  @Field()
  involvedAs: string
}
