import { Field, InputType } from '@nestjs/graphql'
import { LocationAPIInput } from 'defs'

@InputType()
export class LocationInput implements LocationAPIInput {
  @Field()
  address: string

  @Field()
  isActive: boolean
}
