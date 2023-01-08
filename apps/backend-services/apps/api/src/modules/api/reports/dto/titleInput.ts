import { Field, InputType } from '@nestjs/graphql'
import { Title as ReportTitle } from 'defs'

@InputType()
export class TitleInput implements ReportTitle {
  @Field()
  readonly content: string
}
