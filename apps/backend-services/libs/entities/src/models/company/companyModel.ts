import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { CustomFieldModel, CustomFieldSchema } from '../customFieldModel'
import { FileModel } from '../fileModel'
import { AssociateModel, AssociateSchema } from './associateModel'
import { LocationDocument, LocationModel } from '../locationModel'
import { Company } from 'defs'

@Schema({ timestamps: true })
export class CompanyModel implements Company {
  _id: string

  @Prop({ isRequired: true })
  cui: string

  @Prop({ isRequired: true })
  name: string

  @Prop({ type: Types.ObjectId, ref: LocationModel.name, isRequired: false })
  headquarters: LocationDocument | null

  @Prop({ type: [{ type: Types.ObjectId, ref: LocationModel.name }] })
  locations: LocationDocument[]

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

export type CompanyDocument = CompanyModel & Document<string>
export const CompanySchema = SchemaFactory.createForClass(CompanyModel)
