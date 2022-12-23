import { VehicleOwnerInfo } from '@app/definitions/propertyOwner'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class VehicleOwnerInfoInput implements VehicleOwnerInfo {
  @Field()
  readonly registrationNumber: string
}
