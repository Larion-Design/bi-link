import {Field, ObjectType} from '@nestjs/graphql'
import {PersonAPIOutput} from 'defs'
import {CustomField} from '../../customFields/dto/customField'
import {File} from '../../files/dto/file'
import {IdDocument} from './idDocument'
import {Relationship} from './relationship'

@ObjectType()
export class Person implements PersonAPIOutput {
  @Field()
  _id: string

  @Field({ nullable: true })
  birthdate: Date

  @Field({ nullable: true })
  firstName: string

  @Field({ nullable: true })
  lastName: string

  @Field({ nullable: true, defaultValue: '' })
  oldName: string

  @Field({ nullable: true })
  cnp: string

  @Field({ nullable: true })
  homeAddress: string

  @Field(() => [File])
  images: File[]

  @Field(() => [IdDocument], { nullable: true })
  documents: IdDocument[]

  @Field(() => [Relationship], { nullable: true })
  relationships: Relationship[]

  @Field(() => [File], { nullable: true })
  files: File[]

  @Field(() => [CustomField], { nullable: true })
  contactDetails: CustomField[]

  @Field(() => [CustomField], { nullable: true })
  customFields: CustomField[]
}
