import { Field, ObjectType } from '@nestjs/graphql'
import { OptionalDateValue } from '../../generic/dto/optionalDateValue'
import { TextValue } from '../../generic/dto/textValue'
import { Location } from '../../geolocation/dto/location'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { Metadata } from '../../metadata/dto/metadata'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { Party } from './party'
import { EventAPIOutput } from 'defs'

@ObjectType({ implements: () => [WithMetadata] })
export class Event implements WithMetadata, EventAPIOutput {
  metadata: Metadata

  @Field()
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
}
