import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Coordinates } from 'defs'

@Schema({ _id: false, timestamps: false })
export class CoordinatesModel implements Coordinates {
  @Prop({ default: 0 })
  lat: number

  @Prop({ default: 0 })
  long: number

  constructor(lat?: number, long?: number) {
    if (lat) {
      this.lat = lat
    }
    if (long) {
      this.long = long
    }
  }
}

export const CoordinatesSchema = SchemaFactory.createForClass(CoordinatesModel)
