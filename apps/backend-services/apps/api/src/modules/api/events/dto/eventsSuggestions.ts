import { Field, Int, ObjectType } from '@nestjs/graphql'
import { EventsSuggestions as EventsSuggestionsType } from 'defs'
import { EventListRecord } from './eventListRecord'

@ObjectType()
export class EventsSuggestions implements EventsSuggestionsType {
  @Field(() => [EventListRecord])
  records: EventListRecord[]

  @Field(() => Int, { nullable: false })
  total: number
}
