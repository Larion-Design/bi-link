import {
  BooleanValueWithMetadataModel,
  BooleanValueWithMetadataSchema,
} from 'src/metadata/models/booleanValueWithMetadataModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { LocationDocument, LocationModel } from 'src/location/models/locationModel'
import { RealEstateInfo } from 'defs'
import {
  NumberValueWithMetadataModel,
  NumberValueWithMetadataSchema,
} from '../../metadata/models/numberValueWithMetadataModel'

@Schema({ _id: false, timestamps: false })
export class RealEstateInfoModel implements RealEstateInfo {
  @Prop({ type: Types.ObjectId, ref: LocationModel.name, isRequired: false })
  location: LocationDocument | null

  @Prop({ type: NumberValueWithMetadataSchema })
  surface: NumberValueWithMetadataModel

  @Prop({ type: BooleanValueWithMetadataSchema })
  townArea: BooleanValueWithMetadataModel
}

export const RealEstateSchema = SchemaFactory.createForClass(RealEstateInfoModel)
