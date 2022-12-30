import {Field, ObjectType} from '@nestjs/graphql'
import {Report as ReportType} from 'defs'
import {ReportSection} from './reportSection'

@ObjectType()
export class Report implements ReportType {
  @Field()
  name: string

  @Field(() => [ReportSection])
  sections: ReportSection[]
}
