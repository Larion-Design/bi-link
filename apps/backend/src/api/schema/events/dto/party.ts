import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { EventParticipantAPI } from 'defs'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType()
export class Party
  extends PickType(WithMetadata, ['metadata'] as const)
  implements EventParticipantAPI
{
  @Field()
  type: string

  @Field()
  description: string

  @Field(() => [ConnectedEntity])
  persons: ConnectedEntity[]

  @Field(() => [ConnectedEntity])
  companies: ConnectedEntity[]

  @Field(() => [ConnectedEntity])
  properties: ConnectedEntity[]

  @Field(() => [CustomField])
  customFields: CustomField[]
}
