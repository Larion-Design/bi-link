import { Field, InputType, PickType } from '@nestjs/graphql'
import { PersonAPIInput } from 'defs'
import { OptionalDateValueInput } from '../../generic/dto/optionalDateValueInput'
import { TextValueInput } from '../../generic/dto/textValueInput'
import { LocationInput } from '../../geolocation/dto/locationInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { WithMetadataInput } from '../../metadata/dto/withMetadataInput'
import { EducationInput } from './educationInput'
import { IdDocumentInput } from './idDocumentInput'
import { OldNameInput } from './oldNameInput'
import { RelationshipInput } from './relationshipInput'

@InputType()
export class PersonInput
  extends PickType(WithMetadataInput, ['metadata'] as const)
  implements PersonAPIInput
{
  @Field(() => TextValueInput)
  readonly firstName: TextValueInput

  @Field(() => TextValueInput)
  readonly lastName: TextValueInput

  @Field(() => TextValueInput)
  readonly cnp: TextValueInput

  @Field(() => [OldNameInput])
  readonly oldNames: OldNameInput[]

  @Field(() => OptionalDateValueInput)
  readonly birthdate: OptionalDateValueInput

  @Field(() => LocationInput, { nullable: true })
  readonly birthPlace: LocationInput

  @Field(() => LocationInput, { nullable: true })
  readonly homeAddress: LocationInput

  @Field(() => [EducationInput])
  readonly education: EducationInput[]

  @Field(() => [CustomFieldInput])
  readonly contactDetails: CustomFieldInput[]

  @Field(() => [FileInput])
  readonly images: FileInput[]

  @Field(() => [IdDocumentInput])
  readonly documents: IdDocumentInput[]

  @Field(() => [CustomFieldInput])
  readonly customFields: CustomFieldInput[]

  @Field(() => [RelationshipInput])
  readonly relationships: RelationshipInput[]

  @Field(() => [FileInput])
  readonly files: FileInput[]
}
