import { Field, InputType } from '@nestjs/graphql'
import { EducationAPIInput } from 'defs'
import { CustomFieldInput } from '../../customFields/dto/customFieldInput'

@InputType()
export class EducationInput implements EducationAPIInput {
  @Field()
  type: string

  @Field()
  school: string

  @Field()
  specialization: string

  @Field(() => Date, { nullable: true })
  startDate: Date | null

  @Field(() => Date, { nullable: true })
  endDate: Date | null

  @Field(() => [CustomFieldInput])
  customFields: CustomFieldInput[]
}
