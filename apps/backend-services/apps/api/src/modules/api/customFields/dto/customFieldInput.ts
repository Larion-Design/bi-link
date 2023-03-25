import { Field, InputType } from '@nestjs/graphql'
import { Length } from 'class-validator'
import { CustomFieldAPI } from 'defs'
import { MetadataInput } from '../../metadata/dto/metadataInput'

@InputType()
export class CustomFieldInput implements CustomFieldAPI {
  @Field(() => MetadataInput)
  readonly metadata: MetadataInput

  @Length(2, 30)
  @Field()
  readonly fieldName: string

  @Length(1)
  @Field()
  readonly fieldValue: string
}
