import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { PersonAPIOutput } from 'defs'
import { Timestamps } from 'defs/dist/modelTimestamps'
import { OptionalDateValue } from '../../generic/dto/optionalDateValue'
import { TextValue } from '../../generic/dto/textValue'
import { Location } from '../../geolocation/dto/location'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { Education } from './education'
import { IdDocument } from './idDocument'
import { OldName } from './oldName'
import { Relationship } from './relationship'

@ObjectType()
export class Person
  extends PickType(WithMetadata, ['metadata'] as const)
  implements PersonAPIOutput, Timestamps
{
  @Field(() => ID)
  _id: string

  @Field(() => OptionalDateValue)
  birthdate: OptionalDateValue

  @Field(() => Location, { nullable: true })
  birthPlace: Location

  @Field(() => TextValue)
  firstName: TextValue

  @Field(() => TextValue)
  lastName: TextValue

  @Field(() => [OldName], { defaultValue: [] })
  oldNames: OldName[]

  @Field(() => TextValue)
  cnp: TextValue

  @Field(() => Location, { nullable: true })
  homeAddress: Location

  @Field(() => [File])
  images: File[]

  @Field(() => [IdDocument])
  documents: IdDocument[]

  @Field(() => [Relationship])
  relationships: Relationship[]

  @Field(() => [File])
  files: File[]

  @Field(() => [CustomField])
  contactDetails: CustomField[]

  @Field(() => [CustomField])
  customFields: CustomField[]

  @Field(() => [Education], { defaultValue: [] })
  education: Education[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
