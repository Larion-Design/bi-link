import { Field, InputType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { AssociateInput } from './associateInput'
import { Length } from 'class-validator'
import { LocationInput } from '../../geolocation/dto/locationInput'
import { CompanyAPIInput } from 'defs'

@InputType()
export class CompanyInput implements CompanyAPIInput {
  @Field()
  readonly cui: string

  @Length(2, 100)
  @Field()
  readonly name: string

  @Field(() => LocationInput, { nullable: true })
  readonly headquarters: LocationInput

  @Field()
  readonly registrationNumber: string

  @Field(() => [LocationInput])
  readonly locations: LocationInput[]

  @Field(() => [AssociateInput])
  readonly associates: AssociateInput[]

  @Field(() => [CustomFieldInput])
  readonly contactDetails: CustomFieldInput[]

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]

  @Field(() => [FileInput])
  readonly files: FileInput[]
}
