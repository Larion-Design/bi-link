import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { VehicleOwnerInfo } from 'defs'

@Schema({ _id: false, timestamps: false })
export class VehicleOwnerInfoModel implements VehicleOwnerInfo {
  @Prop({ type: [{ type: SchemaTypes.String }], default: [] })
  plateNumbers: string[]
}

export const VehicleOwnerInfoSchema = SchemaFactory.createForClass(VehicleOwnerInfoModel)
