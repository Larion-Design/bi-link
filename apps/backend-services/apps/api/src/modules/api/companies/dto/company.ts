import { Field, ObjectType } from '@nestjs/graphql'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { Associate } from './associate'
import { Location } from './location'
import { CompanyAPIOutput } from '@app/definitions/company'

@ObjectType()
export class Company implements CompanyAPIOutput {
  @Field()
  _id: string

  @Field()
  cui: string

  @Field()
  name: string

  @Field({ nullable: true })
  headquarters: string

  @Field()
  registrationNumber: string

  @Field(() => [CustomField], { nullable: true })
  contactDetails: CustomField[]

  @Field(() => [Location], { nullable: true })
  locations: Location[]

  @Field(() => [Associate], { nullable: true })
  associates: Associate[]

  @Field(() => [CustomField], { nullable: true })
  customFields: CustomField[]

  @Field(() => [File], { nullable: true })
  files: File[]
}
