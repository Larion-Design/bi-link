import { Field, InputType } from '@nestjs/graphql'
import { IsDateString, IsNumberString, IsOptional, Length } from 'class-validator'
import { PersonAPIInput } from 'defs'
import { LocationInput } from '../../common/dto/geolocation/locationInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { FileInput } from '../../files/dto/fileInput'
import { EducationInput } from './educationInput'
import { IdDocumentInput } from './idDocumentInput'
import { OldNameInput } from './oldNameInput'
import { RelationshipInput } from './relationshipInput'

@InputType()
export class PersonInput implements PersonAPIInput {
  @IsOptional()
  @Length(3, 30)
  @Field({ nullable: true })
  readonly firstName: string

  @IsOptional()
  @Length(2, 30)
  @Field({ nullable: true })
  readonly lastName: string

  @IsOptional()
  @IsNumberString()
  @Length(13)
  @Field({ nullable: true })
  readonly cnp: string

  @Field(() => [OldNameInput])
  readonly oldNames: OldNameInput[]

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  readonly birthdate: Date

  @Field(() => LocationInput, { nullable: true })
  readonly birthPlace: LocationInput

  @IsOptional()
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
