import { Field, InputType } from '@nestjs/graphql'
import { LocationAPIInput } from '@app/definitions/location'

@InputType()
export class LocationInput implements LocationAPIInput {
  @Field()
  address: string

  @Field()
  isActive: boolean
}
