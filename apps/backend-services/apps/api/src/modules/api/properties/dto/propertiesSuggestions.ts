import { Field, Int, ObjectType } from '@nestjs/graphql'
import { PropertyListRecord } from './propertyListRecord'

@ObjectType()
export class PropertiesSuggestions {
  @Field(() => Int)
  total: number

  @Field(() => [PropertyListRecord])
  records: PropertyListRecord[]
}
