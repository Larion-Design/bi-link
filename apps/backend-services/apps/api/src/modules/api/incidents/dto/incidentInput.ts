import { Field, InputType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { PartyInput } from './partyInput'
import { IncidentAPIInput } from '@app/definitions/incident'

@InputType()
export class IncidentInput implements IncidentAPIInput {
  @Field()
  readonly description: string

  @Field()
  readonly date: Date

  @Field()
  readonly type: string

  @Field()
  readonly location: string

  @Field(() => [FileInput])
  readonly files: FileInput[]

  @Field(() => [PartyInput])
  readonly parties: PartyInput[]

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]
}
