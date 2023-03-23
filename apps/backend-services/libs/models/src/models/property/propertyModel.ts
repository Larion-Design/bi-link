import {
  RealEstateInfoModel,
  RealEstateSchema,
} from '@app/models/models/property/realEstateInfoModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Property } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '@app/models/models/customFieldModel'
import { FileModel } from '@app/models/models/fileModel'
import {
  PropertyOwnerModel,
  PropertyOwnerSchema,
} from '@app/models/models/property/propertyOwnerModel'
import { VehicleInfoModel, VehicleSchema } from '@app/models/models/property/vehicleInfoModel'

@Schema({ timestamps: true })
export class PropertyModel implements Property {
  _id: string

  @Prop()
  name: string

  @Prop()
  type: string

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  files: FileModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }] })
  images: FileModel[]

  @Prop({ type: [PropertyOwnerSchema] })
  owners: PropertyOwnerModel[]

  @Prop({ type: [CustomFieldSchema] })
  customFields: CustomFieldModel[]

  @Prop({ type: VehicleSchema, isRequired: false, default: null })
  vehicleInfo: VehicleInfoModel | null

  @Prop({ type: RealEstateSchema, isRequired: false, default: null })
  realEstateInfo: RealEstateInfoModel | null
}

export type PropertyDocument = PropertyModel & Document<string>
export const PropertySchema = SchemaFactory.createForClass(PropertyModel)
