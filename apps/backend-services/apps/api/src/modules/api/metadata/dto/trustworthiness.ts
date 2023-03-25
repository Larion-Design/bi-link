import { Field, ObjectType } from '@nestjs/graphql'
import { Trustworthiness as TrustworthinessAPI } from 'defs'

@ObjectType()
export class Trustworthiness implements TrustworthinessAPI {
  @Field()
  level: number

  @Field()
  source: string
}
