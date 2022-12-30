import {Field, InputType} from '@nestjs/graphql'
import {Link as ReportLink} from 'defs'

@InputType()
export class LinkInput implements ReportLink {
  @Field()
  readonly label: string

  @Field()
  readonly url: string
}
