import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { ProceedingEntityInvolvedAPI } from 'defs'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class ProceedingEntity
  extends PickType(WithMetadata, ['metadata'] as const)
  implements ProceedingEntityInvolvedAPI
{
  @Field(() => ConnectedEntity, { nullable: true })
  person: ConnectedEntity

  @Field(() => ConnectedEntity, { nullable: true })
  company: ConnectedEntity

  @Field()
  description: string

  @Field()
  involvedAs: string
}
