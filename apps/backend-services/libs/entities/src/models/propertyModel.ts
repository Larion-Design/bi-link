import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Property } from '@app/definitions/property'
import { CustomFieldModel, CustomFieldSchema } from '@app/entities/models/customFieldModel'
import { FileModel } from '@app/entities/models/fileModel'
import { PropertyOwnerModel, PropertyOwnerSchema } from '@app/entities/models/propertyOwnerModel'
import { VehicleInfoModel, VehicleSchema } from '@app/entities/models/vehicleInfoModel'

@Schema({ timestamps: true })
export class PropertyModel implements Property {
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
  vehicleInfo: VehicleInfoModel
}

export type PropertyDocument = PropertyModel & Document
export const PropertySchema = SchemaFactory.createForClass(PropertyModel)
