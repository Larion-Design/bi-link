import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { RealEstateInfo } from 'defs'
import { LocationDocument, LocationModel } from '../../location/models/locationModel'
import {
  BooleanValueWithMetadataModel,
  BooleanValueWithMetadataSchema,
} from '../../metadata/models/booleanValueWithMetadataModel'
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from '../../metadata/models/numberValueWithMetadataModel'

@Schema({ _id: false, timestamps: false })
export class RealEstateInfoModel implements RealEstateInfo {
  @Prop({
    type: Types.ObjectId,
    ref: LocationModel.name,
    isRequired: false,
    index: true,
    sparse: true,
  })
  location: LocationDocument | null

  @Prop({ type: NumberValueWithMetadataSchema })
  surface: NumberValueWithMetadataModel

  @Prop({ type: BooleanValueWithMetadataSchema })
  townArea: BooleanValueWithMetadataModel
}

export const RealEstateSchema = SchemaFactory.createForClass(RealEstateInfoModel)
