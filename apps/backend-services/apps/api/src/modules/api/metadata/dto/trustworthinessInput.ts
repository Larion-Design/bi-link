import { Field, InputType } from '@nestjs/graphql'
import { Trustworthiness as TrustworthinessAPI } from 'defs'

@InputType()
export class TrustworthinessInput implements TrustworthinessAPI {
  @Field()
  level: number

  @Field()
  source: string
}
