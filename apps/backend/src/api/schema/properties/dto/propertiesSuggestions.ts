import { Field, ObjectType, PickType } from '@nestjs/graphql'
import { Suggestions } from '../../search/dto/suggestions'
import { PropertyListRecord } from './propertyListRecord'

@ObjectType()
export class PropertiesSuggestions extends PickType(Suggestions, ['total'] as const) {
  @Field(() => [PropertyListRecord])
  records: PropertyListRecord[]
}
