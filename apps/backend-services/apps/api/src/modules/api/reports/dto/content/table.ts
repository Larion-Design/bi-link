import { Field, ObjectType } from '@nestjs/graphql'
import { Table as ReportTable } from 'defs'

@ObjectType()
export class Table implements ReportTable {
  @Field()
  id: string
}
