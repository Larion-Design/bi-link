import {
  BooleanValueWithMetadataModel,
  BooleanValueWithMetadataSchema,
} from '@app/models/metadata/models/booleanValueWithMetadataModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { LocationDocument, LocationModel } from '@app/models/location/models/locationModel'
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
