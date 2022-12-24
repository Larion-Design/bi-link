import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { PersonDocument, PersonModel } from './personModel'
import { CustomFieldModel, CustomFieldSchema } from './customFieldModel'
import { Associate } from 'defs'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'

@Schema({ _id: false })
export class AssociateModel implements Associate {
  @Prop({ isRequired: false, default: true })
  _confirmed: boolean

  @Prop()
  role: string

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: 'CompanyModel', isRequired: false })
  company?: CompanyDocument

  @Prop()
  equity: number

  @Prop({ isRequired: false, default: null })
  startDate: Date | null

  @Prop({ isRequired: false, default: null })
  endDate: Date | null

  @Prop({ isRequired: false })
  isActive: boolean

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type AssociateDocument = AssociateModel & Document
export const AssociateSchema = SchemaFactory.createForClass(AssociateModel)
