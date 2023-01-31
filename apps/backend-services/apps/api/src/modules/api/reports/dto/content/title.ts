import { Field, ObjectType } from '@nestjs/graphql'
import { Title as ReportTitle } from 'defs'

@ObjectType()
export class Title implements ReportTitle {
  @Field()
  content: string
}
