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

@Schema({ timestamps: false })
export class PropertyOwnerModel implements PropertyOwner {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  startDate: OptionalDateValueWithMetadataModel

  @Prop({ type: OptionalDateValueWithMetadataSchema })
  endDate: OptionalDateValueWithMetadataModel

  @Prop({
    type: Types.ObjectId,
    ref: PersonModel.name,
    isRequired: false,
    index: true,
    sparse: true,
  })
  person?: PersonDocument

  @Prop({
    type: Types.ObjectId,
    ref: CompanyModel.name,
    isRequired: false,
    index: true,
    sparse: true,
  })
  company?: CompanyDocument

  @Prop({ type: [CustomFieldSchema], default: [] })
  customFields: CustomFieldModel[]

  @Prop({ type: VehicleOwnerInfoSchema, isRequired: false, default: null })
  vehicleOwnerInfo: VehicleOwnerInfoModel
}

export type PropertyOwnerDocument = PropertyOwnerModel & Document
export const PropertyOwnerSchema = SchemaFactory.createForClass(PropertyOwnerModel)
