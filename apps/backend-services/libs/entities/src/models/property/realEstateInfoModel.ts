import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { LocationDocument, LocationModel } from '@app/entities/models/locationModel'
import { RealEstateInfo } from 'defs'

@Schema({ _id: false, timestamps: false })
export class RealEstateInfoModel implements RealEstateInfo {
  @Prop({ type: Types.ObjectId, ref: LocationModel.name, isRequired: false })
  location: LocationDocument | null

  @Prop()
  surface: number

  @Prop()
  townArea: boolean
}

export const RealEstateSchema = SchemaFactory.createForClass(RealEstateInfoModel)
