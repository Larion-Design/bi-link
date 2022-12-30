import {Field, InputType} from '@nestjs/graphql'
import {Text as ReportText} from 'defs'

@InputType()
export class TextInput implements ReportText {
  @Field()
  readonly content: string
}
