import { Field, InputType } from '@nestjs/graphql'
import { ReportSection as ReportSectionType } from 'defs'
import { ReportContentInput } from './reportContentInput'

@InputType()
export class ReportSectionInput implements ReportSectionType {
  @Field()
  name: string

  @Field(() => [ReportContentInput])
  content: ReportContentInput[]
}
