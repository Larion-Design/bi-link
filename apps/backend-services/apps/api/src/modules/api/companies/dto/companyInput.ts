import { Field, InputType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { AssociateInput } from './associateInput'
import { Length } from 'class-validator'
import { LocationInput } from './locationInput'
import { CompanyAPIInput } from '@app/definitions/company'

@InputType()
export class CompanyInput implements CompanyAPIInput {
  @Field()
  readonly cui: string

  @Length(2, 100)
  @Field()
  readonly name: string

  @Length(2, 100)
  @Field()
  readonly headquarters: string

  @Field()
  readonly registrationNumber: string

  @Field(() => [LocationInput], { nullable: true })
  readonly locations: LocationInput[]

  @Field(() => [AssociateInput], { nullable: true })
  readonly associates: AssociateInput[]

  @Field(() => [CustomFieldInput], { nullable: true })
  readonly contactDetails: CustomFieldInput[]

  @Field(() => [CustomFieldInput], { nullable: true })
  readonly customFields: CustomFieldInput[]

  @Field(() => [FileInput], { nullable: true })
  readonly files: FileInput[]
}
