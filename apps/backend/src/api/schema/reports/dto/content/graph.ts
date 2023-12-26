import { Field, ObjectType } from '@nestjs/graphql'
import { GraphAPI } from 'defs'

@ObjectType()
export class Graph implements GraphAPI {
  @Field()
  label: string
}
