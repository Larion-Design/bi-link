import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'

@Schema({ _id: false, timestamps: false })
export class CoordinatesModel {
  @Prop({ type: SchemaTypes.Decimal128 })
  lat: number

  @Prop({ type: SchemaTypes.Decimal128 })
  long: number
}

export const CoordinatesSchema = SchemaFactory.createForClass(CoordinatesModel)
