import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Property } from 'defs'
import { CustomFieldModel, CustomFieldSchema } from '../../customField/models/customFieldModel'
import { FileModel } from '../../file/models/fileModel'
import { MetadataModel, MetadataSchema } from '../../metadata/models/metadataModel'
import { PropertyOwnerModel, PropertyOwnerSchema } from './propertyOwnerModel'
import { RealEstateInfoModel, RealEstateSchema } from './realEstateInfoModel'
import { VehicleInfoModel, VehicleSchema } from './vehicleInfoModel'

@Schema({ timestamps: true })
export class PropertyModel implements Property {
  _id: string

  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

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

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type PropertyDocument = PropertyModel & Document<string>
export const PropertySchema = SchemaFactory.createForClass(PropertyModel)
