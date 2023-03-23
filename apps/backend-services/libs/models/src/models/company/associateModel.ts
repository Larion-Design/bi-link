import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types, SchemaTypes } from 'mongoose'
import { PersonDocument, PersonModel } from '@app/models/models'
import { CustomFieldModel, CustomFieldSchema } from '@app/models/models'
import { Associate } from 'defs'
import { CompanyDocument, CompanyModel } from '@app/models/models/company/companyModel'

@Schema({ _id: false, timestamps: false })
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

  @Prop({ type: SchemaTypes.Date, isRequired: false, default: null })
  startDate: Date | null

  @Prop({ type: SchemaTypes.Date, isRequired: false, default: null })
  endDate: Date | null

  @Prop({ isRequired: false })
  isActive: boolean

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type AssociateDocument = AssociateModel & Document
export const AssociateSchema = SchemaFactory.createForClass(AssociateModel)
