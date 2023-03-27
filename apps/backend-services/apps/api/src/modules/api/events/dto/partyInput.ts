import { Field, InputType, PickType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { ConnectedEntityInput } from '../../entityInfo/dto/connectedEntityInput'
import { EventParticipantAPI } from 'defs'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'

@InputType()
export class PartyInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements EventParticipantAPI
{
  @Field()
  readonly type: string

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
