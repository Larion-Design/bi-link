import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Location } from '@app/definitions/location'

@Schema({ _id: false })
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

export type LocationDocument = LocationModel & Document
export const LocationSchema = SchemaFactory.createForClass(LocationModel)
