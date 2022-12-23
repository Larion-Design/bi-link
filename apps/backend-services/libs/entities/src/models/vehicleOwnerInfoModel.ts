import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { VehicleOwnerInfo } from '@app/definitions/propertyOwner'

@Schema({ _id: false })
export class VehicleOwnerInfoModel implements VehicleOwnerInfo {
  @Prop({ isRequired: false })
  registrationNumber: string
}

export type VehicleOwnerInfoDocument = VehicleOwnerInfoModel & Document
export const VehicleOwnerInfoSchema = SchemaFactory.createForClass(VehicleOwnerInfoModel)
