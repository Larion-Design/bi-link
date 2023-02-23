import { Field, ObjectType } from '@nestjs/graphql'
import { Text as ReportText } from 'defs'

@ObjectType()
export class Text implements ReportText {
  @Field()
  content: string
}
