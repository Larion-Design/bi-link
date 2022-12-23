import { Field, InputType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { ConnectedEntityInput } from '../../common/dto/connectedEntityInput'
import { PartyAPI } from '@app/definitions/party'

@InputType()
export class PartyInput implements PartyAPI {
  @Field()
  readonly name: string

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

  @Field({ nullable: true, defaultValue: true })
  readonly _confirmed: boolean
}
