import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { CustomFieldModel, CustomFieldSchema } from './customFieldModel'
import { FileModel } from './fileModel'
import { AssociateModel, AssociateSchema } from './associateModel'
import { LocationModel, LocationSchema } from './locationModel'
import { Company } from '@app/definitions/company'

@Schema({ timestamps: true })
export class CompanyModel implements Company {
  @Prop({ isRequired: true })
  cui: string

  @Prop({ isRequired: true })
  name: string

  @Prop({ isRequired: true })
  headquarters: string

  @Prop({ type: [LocationSchema], isRequired: false })
  locations: LocationModel[]

  @Prop({ isRequired: true })
  registrationNumber: string

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  contactDetails: CustomFieldModel[]

  @Prop({ type: [AssociateSchema], isRequired: false })
  associates: AssociateModel[]

  @Prop({
    type: [{ type: Types.ObjectId, ref: FileModel.name }],
  })
  files: FileModel[]

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type CompanyDocument = CompanyModel & Document
export const CompanySchema = SchemaFactory.createForClass(CompanyModel)
