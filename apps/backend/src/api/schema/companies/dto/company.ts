import { CompanyRelationship } from '@modules/api/schema/companies/dto/company-relationship'
import { Field, ID, ObjectType, PickType } from '@nestjs/graphql'
import { CompanyAPIOutput } from 'defs'
import { CustomField } from '../../customFields/dto/customField'
import { File } from '../../files/dto/file'
import { OptionalDateValue } from '../../generic/dto/optionalDateValue'
import { TextValue } from '../../generic/dto/textValue'
import { WithMetadata } from '../../metadata/dto/withMetadata'
import { Associate } from './associate'
import { Location } from '../../geolocation/dto/location'
import { BalanceSheet } from './balanceSheet'
import { CompanyActiveState } from './companyActiveState'
import { CompanyStatus } from './companyStatus'

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

  @Field(() => [CustomField])
  contactDetails: CustomField[]

  @Field(() => [Location])
  locations: Location[]

  @Field(() => [Associate])
  associates: Associate[]

  @Field(() => [CustomField])
  customFields: CustomField[]

  @Field(() => [File])
  files: File[]

  @Field(() => [CustomField])
  activityCodes: CustomField[]

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date

  @Field(() => CompanyActiveState)
  active: CompanyActiveState

  @Field(() => [BalanceSheet])
  balanceSheets: BalanceSheet[]

  @Field(() => OptionalDateValue)
  registrationDate: OptionalDateValue

  @Field(() => CompanyStatus)
  status: CompanyStatus

  @Field(() => [File], { nullable: true, defaultValue: [] })
  images?: File[]

  @Field(() => [CompanyRelationship], { nullable: true, defaultValue: [] })
  relationships?: CompanyRelationship[]
}
