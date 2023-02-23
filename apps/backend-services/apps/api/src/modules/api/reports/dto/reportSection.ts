import { Field, ObjectType } from '@nestjs/graphql'
import { ReportSection as ReportSectionType } from 'defs'
import { ReportContent } from './reportContent'

@ObjectType()
export class ReportSection implements ReportSectionType {
  @Field()
  name: string

  @Field(() => [ReportContent])
  content: ReportContent[]
}
