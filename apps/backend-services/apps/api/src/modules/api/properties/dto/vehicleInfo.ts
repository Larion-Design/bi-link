import { VehicleInfo as VehicleInfoType } from '@app/definitions/property'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleInfo implements VehicleInfoType {
  @Field()
  vin: string

  @Field()
  maker: string

  @Field()
  model: string

  @Field()
  color: string
}
