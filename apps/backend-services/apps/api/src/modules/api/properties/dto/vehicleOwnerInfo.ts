import { VehicleOwnerInfo as VehicleOwnerInfoType } from '@app/definitions/propertyOwner'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class VehicleOwnerInfo implements VehicleOwnerInfoType {
  @Field()
  registrationNumber: string
}
