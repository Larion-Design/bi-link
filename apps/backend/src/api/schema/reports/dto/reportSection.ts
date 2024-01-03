import { Field, ObjectType } from '@nestjs/graphql'
import { ReportSectionAPIOutput } from 'defs'
import { ReportContent } from './reportContent'

@ObjectType()
export class ReportSection implements ReportSectionAPIOutput {
  @Field()
  name: string

  @Field(() => [ReportContent])
  content: ReportContent[]
}
