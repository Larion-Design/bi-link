import { Field, InputType, PickType } from '@nestjs/graphql'
import { OptionalDateValueInput } from '../../generic/dto/optionalDateValueInput'
import { TextValueInput } from '../../generic/dto/textValueInput'
import { LocationInput } from '../../geolocation/dto/locationInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'
import { PartyInput } from './partyInput'
import { EventAPIInput } from 'defs'

@InputType()
export class EventInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements EventAPIInput
{
  @Field()
  readonly description: string

  @Field(() => OptionalDateValueInput)
  readonly date: OptionalDateValueInput

  @Field(() => OptionalDateValueInput)
  readonly type: TextValueInput

  @Field(() => LocationInput, { nullable: true })
  readonly location: LocationInput

  @Field(() => [FileInput])
  readonly files: FileInput[]

  @Field(() => [PartyInput])
  readonly parties: PartyInput[]

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]
}
