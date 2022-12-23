import { Field, ObjectType } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { ConnectedEntity } from '../../common/dto/connectedEntity'
import { PartyAPI } from '@app/definitions/party'

@ObjectType()
export class Party implements PartyAPI {
  @Field()
  name: string

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

  @Field({ nullable: true, defaultValue: true })
  _confirmed: boolean
}
