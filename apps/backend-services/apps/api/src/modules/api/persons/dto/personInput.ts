import { Field, InputType } from '@nestjs/graphql'
import { FileInput } from '../../files/dto/fileInput'
import { IdDocumentInput } from './idDocumentInput'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'
import { RelationshipInput } from './relationshipInput'
import { IsDateString, IsNumberString, IsOptional, Length } from 'class-validator'
import { PersonAPIInput } from 'defs'

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

  @IsOptional()
  @Length(2, 50)
  @Field({ nullable: true })
  readonly oldName: string

  @IsOptional()
  @IsDateString()
  @Field({ nullable: true })
  readonly birthdate: Date

  @IsOptional()
  @Length(2, 100)
  @Field({ nullable: true })
  readonly homeAddress: string

  @Field(() => [CustomFieldInput], { nullable: true })
  readonly contactDetails: CustomFieldInput[]

  @Field(() => FileInput, { nullable: true })
  readonly image: FileInput

  @Field(() => [IdDocumentInput], { nullable: true })
  readonly documents: IdDocumentInput[]

  @Field(() => [CustomFieldInput], { nullable: true })
  readonly customFields: CustomFieldInput[]

  @Field(() => [RelationshipInput], { nullable: true })
  readonly relationships: RelationshipInput[]

  @Field(() => [FileInput], { nullable: true })
  readonly files: FileInput[]
}
