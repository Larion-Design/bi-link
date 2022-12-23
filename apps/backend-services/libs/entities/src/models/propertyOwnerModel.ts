import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { PropertyOwner } from '@app/definitions/propertyOwner'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '@app/entities/models/customFieldModel'
import {
  VehicleOwnerInfoModel,
  VehicleOwnerInfoSchema,
} from '@app/entities/models/vehicleOwnerInfoModel'

@Schema({ timestamps: false, _id: false })
export class PropertyOwnerModel implements PropertyOwner {
  @Prop({ isRequired: false, default: true })
  _confirmed: boolean

  @Prop({ isRequired: false, default: null })
  startDate: Date | null

  @Prop({ isRequired: false, default: null })
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
