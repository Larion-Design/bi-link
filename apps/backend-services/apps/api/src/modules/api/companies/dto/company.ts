import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { CompanyAPIOutput } from 'defs'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { TextValue } from '../../generic/dto/textValue'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { Associate } from './associate'
import { Location } from '../../geolocation/dto/location'

@ObjectType()
export class Company
  extends PickType(WithMetadata, ['metadata'] as const)
  implements CompanyAPIOutput
{
  @Field(() => ID)
  _id: string

  @Field(() => TextValue)
  cui: TextValue

  @Field(() => TextValue)
  name: TextValue

  @Field(() => Location, { nullable: true })
  headquarters: Location

  @Field(() => TextValue)
  registrationNumber: TextValue

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

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
