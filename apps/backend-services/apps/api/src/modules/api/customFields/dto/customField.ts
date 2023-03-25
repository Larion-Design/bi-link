import { Field, ObjectType } from '@nestjs/graphql'
import { CustomFieldAPI } from 'defs'
import { Metadata } from '../../metadata/dto/metadata'

@ObjectType()
export class CustomField implements CustomFieldAPI {
  @Field(() => Metadata)
  metadata: Metadata

  @Field()
  fieldName: string

  @Field()
  fieldValue: string
}
