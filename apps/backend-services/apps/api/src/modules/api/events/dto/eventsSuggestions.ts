import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { EventsSuggestions as EventsSuggestionsType } from 'defs'
import { Suggestions } from '../../common/dto/suggestions'
import { EventListRecord } from './eventListRecord'

@ObjectType()
export class EventsSuggestions
  extends PickType(Suggestions, ['total'] as const)
  implements EventsSuggestionsType
{
  @Field(() => [EventListRecord])
  records: EventListRecord[]
}
