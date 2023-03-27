import { Field, InputType, PickType } from '@nestjs/graphql'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { TextValueInput } from '../../generic/dto/textValueInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'
import { AssociateInput } from './associateInput'
import { LocationInput } from '../../geolocation/dto/locationInput'
import { CompanyAPIInput } from 'defs'

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
}
