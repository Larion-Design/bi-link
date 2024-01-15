import { CompanyRelationshipInput } from '@modules/api/schema/companies/dto/company-relationship.input'
import { Field, InputType, PickType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { OptionalDateValueInput } from '../../generic/dto/optionalDateValueInput'
import { TextValueInput } from '../../generic/dto/textValueInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'
import { AssociateInput } from './associateInput'
import { LocationInput } from '../../geolocation/dto/locationInput'
import { CompanyAPIInput } from 'defs'
import { BalanceSheetInput } from './balanceSheetInput'
import { CompanyActiveStateInput } from './companyActiveStateInput'
import { CompanyStatusInput } from './companyStatusInput'

@InputType()
export class CompanyInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements CompanyAPIInput
{
  @Field(() => TextValueInput)
  readonly cui: TextValueInput

  @Field(() => TextValueInput)
  readonly name: TextValueInput

  @Field(() => LocationInput, { nullable: true })
  readonly headquarters: LocationInput

  @Field(() => TextValueInput)
  readonly registrationNumber: TextValueInput

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

  @Field(() => CompanyActiveStateInput)
  readonly active: CompanyActiveStateInput

  @Field(() => [BalanceSheetInput])
  readonly balanceSheets: BalanceSheetInput[]

  @Field(() => OptionalDateValueInput)
  readonly registrationDate: OptionalDateValueInput

  @Field(() => CompanyStatusInput)
  readonly status: CompanyStatusInput

  @Field(() => [CustomFieldInput])
  readonly activityCodes: CustomFieldInput[]

  @Field(() => [FileInput], { nullable: true })
  readonly images?: FileInput[]

  @Field(() => [CompanyRelationshipInput], { nullable: true })
  readonly relationships?: CompanyRelationshipInput[]
}
