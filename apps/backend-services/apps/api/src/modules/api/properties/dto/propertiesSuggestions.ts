import { Field, Int, ObjectType, PickType } from '@nestjs/graphql'
import { Suggestions } from '../../common/dto/suggestions'
import { PropertyListRecord } from './propertyListRecord'

@ObjectType()
export class PropertiesSuggestions extends PickType(Suggestions, ['total'] as const) {
  @Field(() => [PropertyListRecord])
  records: PropertyListRecord[]
}
