import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Location } from 'defs'
import { CoordinatesModel, CoordinatesSchema } from '@app/models/models/coordinatesModel'

@Schema({ timestamps: false })
export class LocationModel implements Location {
  _id: string

  @Prop()
  building: string

  @Prop()
  country: string

  @Prop()
  county: string

  @Prop()
  door: string

  @Prop()
  locality: string

  @Prop()
  locationId: string

  @Prop()
  number: string

  @Prop()
  street: string

  @Prop()
  zipCode: string

  @Prop()
  otherInfo: string

  @Prop({ type: [CoordinatesSchema], isRequired: false })
  coordinates: CoordinatesModel
}

export type LocationDocument = LocationModel & Document<string>
export const LocationSchema = SchemaFactory.createForClass(LocationModel)