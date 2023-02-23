import { Field, ObjectType } from '@nestjs/graphql'
import { Link as ReportLink } from 'defs'

@ObjectType()
export class Link implements ReportLink {
  @Field()
  label: string

  @Field()
  url: string
}
