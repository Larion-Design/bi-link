import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { VehicleOwnerInfo } from 'defs'

@Schema({ _id: false, timestamps: false })
export class VehicleOwnerInfoModel implements VehicleOwnerInfo {
  @Prop({ isRequired: false })
  registrationNumber: string
}

export const VehicleOwnerInfoSchema = SchemaFactory.createForClass(VehicleOwnerInfoModel)
