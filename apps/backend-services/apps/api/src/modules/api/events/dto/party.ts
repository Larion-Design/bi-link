import { Field, ObjectType } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { ConnectedEntity } from '../../entityInfo/dto/connectedEntity'
import { EventParticipantAPI } from 'defs'
import { Metadata } from '../../metadata/dto/metadata'
import { WithMetadata } from '../../metadata/dto/withMetadata'

@ObjectType({ implements: () => [WithMetadata] })
export class Party implements EventParticipantAPI {
  metadata: Metadata

  @Field()
  type: string

  @Field({ nullable: true })
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
