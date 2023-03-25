import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { VehicleInfo } from 'defs'
import {
  TextValueWithMetadataModel,
  TextValueWithMetadataSchema,
} from '../generic/textValueWithMetadataModel'

@Schema({ _id: false, timestamps: false })
export class VehicleInfoModel implements VehicleInfo {
  @Prop({ type: TextValueWithMetadataSchema })
  vin: TextValueWithMetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  maker: TextValueWithMetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  color: TextValueWithMetadataModel

  @Prop({ type: TextValueWithMetadataSchema })
  model: TextValueWithMetadataModel
}

export const VehicleSchema = SchemaFactory.createForClass(VehicleInfoModel)
