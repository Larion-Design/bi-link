import { Field, InputType } from '@nestjs/graphql'
import { ReportSectionAPIInput } from 'defs'
import { ReportContentInput } from './reportContentInput'

@InputType()
export class ReportSectionInput implements ReportSectionAPIInput {
  @Field()
  name: string

  @Field(() => [ReportContentInput])
  content: ReportContentInput[]
}
