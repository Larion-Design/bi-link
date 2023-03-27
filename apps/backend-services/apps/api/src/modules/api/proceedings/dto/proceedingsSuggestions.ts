import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { Suggestions } from '../../search/dto/suggestions'
import { ProceedingListRecord } from './proceedingListRecord'

@ObjectType()
export class ProceedingsSuggestions extends PickType(Suggestions, ['total'] as const) {
  @Field(() => [ProceedingListRecord])
  records: ProceedingListRecord[]
}
