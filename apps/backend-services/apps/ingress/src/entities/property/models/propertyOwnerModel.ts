import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { PropertyOwner } from 'defs'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '../../customField/models/customFieldModel'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from '../../metadata/models/optionalDateValueWithMetadataModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import { VehicleOwnerInfoModel, VehicleOwnerInfoSchema } from './vehicleOwnerInfoModel'

@Schema({ timestamps: false, _id: false })
export class PropertyOwnerModel implements PropertyOwner {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  startDate: OptionalDateValueWithMetadataModel

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  endDate: OptionalDateValueWithMetadataModel

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: CompanyModel.name, isRequired: false })
  company?: CompanyDocument

  @Prop({ type: [CustomFieldSchema] })
  customFields: CustomFieldModel[]

  @Prop({ type: VehicleOwnerInfoSchema, isRequired: false, default: null })
  vehicleOwnerInfo: VehicleOwnerInfoModel
}

export type PropertyOwnerDocument = PropertyOwnerModel & Document
export const PropertyOwnerSchema = SchemaFactory.createForClass(PropertyOwnerModel)
