import { Field, InputType } from '@nestjs/graphql'
import { GraphAPI } from 'defs'

@InputType()
export class GraphInput implements GraphAPI {
  @Field()
  label: string
}
