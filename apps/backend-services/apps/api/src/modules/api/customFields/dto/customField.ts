import { Field, ObjectType } from '@nestjs/graphql'
import { CustomFieldAPI } from 'defs'

@ObjectType()
export class CustomField implements CustomFieldAPI {
  @Field({ nullable: true })
  readonly _id?: string

  @Field()
  readonly fieldName: string

  @Field()
  readonly fieldValue: string
}
