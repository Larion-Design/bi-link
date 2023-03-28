import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { PropertyOwner } from 'defs'
import { MetadataModel, MetadataSchema } from '@app/models/metadata/models/metadataModel'
import {
  OptionalDateValueWithMetadataModel,
  OptionalDateValueWithMetadataSchema,
} from '@app/models/metadata/models/optionalDateValueWithMetadataModel'
import { PersonDocument, PersonModel } from '@app/models/person/models/personModel'
import { CompanyDocument, CompanyModel } from '@app/models/company/models/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '@app/models/shared/models/customFieldModel'
import {
  VehicleOwnerInfoModel,
  VehicleOwnerInfoSchema,
} from '@app/models/property/models/vehicleOwnerInfoModel'

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