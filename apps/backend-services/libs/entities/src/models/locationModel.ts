import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Location } from 'defs'

@Schema({ _id: false, timestamps: false })
export class LocationModel implements Location {
  constructor(locationInfo?: Location) {
    if (locationInfo) {
      this.address = locationInfo.address
      this.isActive = locationInfo.isActive
    }
  }

  @Prop()
  address: string

  @Prop()
  isActive: boolean
}

export const LocationSchema = SchemaFactory.createForClass(LocationModel)
