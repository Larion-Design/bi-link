import { Field, ObjectType } from '@nestjs/graphql'
import { EducationAPIOutput } from 'defs'
import { CustomField } from '../../customFields/dto/customField'

@ObjectType()
export class Education implements EducationAPIOutput {
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

  @Field(() => [CustomField])
  customFields: CustomField[]
}
