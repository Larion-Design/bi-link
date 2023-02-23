import { Field, InputType } from '@nestjs/graphql'
import { Length } from 'class-validator'
import { CustomFieldAPI } from 'defs'

@InputType()
export class CustomFieldInput implements CustomFieldAPI {
  @Field({ nullable: true })
  readonly _id?: string

  @Length(2, 30)
  @Field()
  readonly fieldName: string

  @Length(1)
  @Field()
  readonly fieldValue: string
}
