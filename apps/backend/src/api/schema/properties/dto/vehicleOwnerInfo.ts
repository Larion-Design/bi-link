import { VehicleOwnerInfo as VehicleOwnerInfoType } from 'defs'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleOwnerInfo implements VehicleOwnerInfoType {
  @Field(() => [String])
  plateNumbers: string[]
}
