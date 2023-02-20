import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, SchemaTypes } from 'mongoose'
import { PropertyOwner } from 'defs'
import { PersonDocument, PersonModel } from '@app/entities/models/person/personModel'
import { CompanyDocument, CompanyModel } from '@app/entities/models/company/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '@app/entities/models/customFieldModel'
import {
  VehicleOwnerInfoModel,
  VehicleOwnerInfoSchema,
} from '@app/entities/models/property/vehicleOwnerInfoModel'

@Schema({ timestamps: false, _id: false })
export class PropertyOwnerModel implements PropertyOwner {
  @Prop({ isRequired: false, default: true })
  _confirmed: boolean

  @Prop({ type: SchemaTypes.Date, isRequired: false, default: null })
  startDate: Date | null

  @Prop({ type: SchemaTypes.Date, isRequired: false, default: null })
  endDate: Date | null

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
