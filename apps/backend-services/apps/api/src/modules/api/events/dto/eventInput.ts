import { Field, InputType } from '@nestjs/graphql'
import { LocationInput } from '../../geolocation/dto/locationInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { PartyInput } from './partyInput'
import { EventAPIInput } from 'defs'

@InputType()
export class EventInput implements EventAPIInput {
  @Field()
  readonly description: string

  @Field()
  readonly date: Date

  @Field()
  readonly type: string

  @Field(() => LocationInput, { nullable: true })
  readonly location: LocationInput

  @Field(() => [FileInput])
  readonly files: FileInput[]

  @Field(() => [PartyInput])
  readonly parties: PartyInput[]

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]
}
