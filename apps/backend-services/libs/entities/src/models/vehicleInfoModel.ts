import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { VehicleInfo } from '@app/definitions/property'

@Schema({ _id: false })
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

export type VehicleInfoDocument = VehicleInfoModel & Document
export const VehicleSchema = SchemaFactory.createForClass(VehicleInfoModel)
