import { Field, InputType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { EventParticipantAPI } from 'defs'
import { MetadataInput } from '../../metadata/dto/metadataInput'

@InputType()
export class PartyInput implements EventParticipantAPI {
  @Field()
  readonly type: string

  @Field(() => MetadataInput)
  readonly metadata: MetadataInput

  @Field()
  readonly description: string

  @Field(() => [ConnectedEntityInput])
  readonly persons: ConnectedEntityInput[]

  @Field(() => [ConnectedEntityInput])
  readonly companies: ConnectedEntityInput[]

  @Field(() => [ConnectedEntityInput])
  readonly properties: ConnectedEntityInput[]

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]
}
