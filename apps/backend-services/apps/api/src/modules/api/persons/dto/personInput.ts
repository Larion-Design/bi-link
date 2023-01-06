import {Field, InputType} from '@nestjs/graphql'
import {IsDateString, IsNumberString, IsOptional, Length} from 'class-validator'
import {PersonAPIInput} from 'defs'
import {CustomFieldInput} from '../../customFields/dto/customFieldInput'
import {FileInput} from '../../files/dto/fileInput'
import {IdDocumentInput} from './idDocumentInput'
import {RelationshipInput} from './relationshipInput'

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
