import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PersonListRecord } from './personListRecord'

@ObjectType()
export class PersonsSuggestions {
  @Field(() => [PersonListRecord], { nullable: 'items' })
  records: PersonListRecord[]

  @Field(() => Int, { nullable: false })
  total: number
}
