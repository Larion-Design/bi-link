import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { Timestamps } from 'defs'
import { OptionalDateValue } from '../../generic/dto/optionalDateValue'
import { TextValue } from '../../generic/dto/textValue'
import { Location } from '../../geolocation/dto/location'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { Party } from './party'
import { EventAPIOutput } from 'defs'

@ObjectType()
export class Event
  extends PickType(WithMetadata, ['metadata'] as const)
  implements EventAPIOutput, Timestamps
{
  @Field(() => ID)
  _id: string

  @Field(() => OptionalDateValue)
  date: OptionalDateValue

  @Field()
  type: TextValue

  @Field(() => Location, { nullable: true })
  location: Location

  @Field()
  description: string

  @Field(() => [Party])
  parties: Party[]

  @Field(() => [CustomField])
  customFields: CustomField[]

  @Field(() => [File])
  files: File[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
