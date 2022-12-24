import { VehicleOwnerInfo } from 'defs'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class VehicleOwnerInfoInput implements VehicleOwnerInfo {
  @Field()
  readonly registrationNumber: string
}
