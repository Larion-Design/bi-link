import { VehicleInfo } from 'defs'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class VehicleInfoInput implements VehicleInfo {
  @Field()
  readonly vin: string

  @Field()
  readonly maker: string

  @Field()
  readonly model: string

  @Field()
  readonly color: string
}
