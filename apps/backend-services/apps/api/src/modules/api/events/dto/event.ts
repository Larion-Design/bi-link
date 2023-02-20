import { Field, ObjectType } from '@nestjs/graphql'
import { Location } from '../../common/dto/geolocation/location'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { Party } from './party'
import { EventAPIOutput } from 'defs'

@ObjectType()
export class Event implements EventAPIOutput {
  @Field()
  _id: string

  @Field({ nullable: true })
  date: Date

  @Field()
  type: string

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
