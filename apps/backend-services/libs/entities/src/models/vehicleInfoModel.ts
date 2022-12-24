import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { VehicleInfo } from 'defs'

@Schema({ _id: false, timestamps: false })
export class VehicleInfoModel implements VehicleInfo {
  @Prop({ isRequired: false })
  vin: string

  @Prop({ isRequired: false })
  maker: string

  @Prop({ isRequired: false })
  color: string

  @Prop({ isRequired: false })
  model: string
}

export const VehicleSchema = SchemaFactory.createForClass(VehicleInfoModel)
