import {Field, InputType} from '@nestjs/graphql'
import {Table as ReportTable} from 'defs'

@InputType()
export class TableInput implements ReportTable {
  @Field()
  readonly id: string
}
