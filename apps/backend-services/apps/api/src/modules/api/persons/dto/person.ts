import { Field, ObjectType } from '@nestjs/graphql'
import { PersonAPIOutput } from 'defs'
import { Location } from '../../common/dto/geolocation/location'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { Education } from './education'
import { IdDocument } from './idDocument'
import { OldName } from './oldName'
import { Relationship } from './relationship'

@ObjectType()
export class Person implements PersonAPIOutput {
  @Field()
  _id: string

  @Field({ nullable: true })
  birthdate: Date

  @Field(() => Location, { nullable: true })
  birthPlace: Location

  @Field()
  firstName: string

  @Field()
  lastName: string

  @Field(() => [OldName])
  oldNames: OldName[]

  @Field()
  cnp: string

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

  @Field(() => [Education])
  education: Education[]
}
