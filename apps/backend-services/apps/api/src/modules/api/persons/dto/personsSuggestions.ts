import { Field, Int, ObjectType, PickType } from '@nestjs/graphql'
import { Suggestions } from '../../search/dto/suggestions'
import { PersonListRecord } from './personListRecord'

@ObjectType()
export class PersonsSuggestions extends PickType(Suggestions, ['total'] as const) {
  @Field(() => [PersonListRecord])
  records: PersonListRecord[]
}
