import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Coordinates } from 'defs'
import { SchemaTypes } from 'mongoose'

@Schema({ _id: false, timestamps: false })
export class CoordinatesModel implements Coordinates {
  @Prop({ type: SchemaTypes.Decimal128 })
  lat: number

  @Prop({ type: SchemaTypes.Decimal128 })
  long: number
}

export const CoordinatesSchema = SchemaFactory.createForClass(CoordinatesModel)
