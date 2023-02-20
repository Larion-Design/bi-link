import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Party } from 'defs'
import { PersonDocument, PersonModel } from '@app/entities/models/person/personModel'
import { CompanyDocument, CompanyModel } from '@app/entities/models/company/companyModel'
import { CustomFieldModel, CustomFieldSchema } from '../customFieldModel'
import { PropertyDocument, PropertyModel } from '@app/entities/models/property/propertyModel'

@Schema({ _id: false, timestamps: true })
export class PartyModel implements Party {
  @Prop({ isRequired: false, default: true })
  _confirmed: boolean

  @Prop()
  name: string

  @Prop()
  description: string

  @Prop({ type: [{ type: Types.ObjectId, ref: PersonModel.name }] })
  persons: PersonDocument[]

  @Prop({ type: [{ type: Types.ObjectId, ref: CompanyModel.name }] })
  companies: CompanyDocument[]

  @Prop({ type: [{ type: Types.ObjectId, ref: PropertyModel.name }] })
  properties: PropertyDocument[]

  @Prop({ type: [CustomFieldSchema], isRequired: false })
  customFields: CustomFieldModel[]
}

export type PartyDocument = PartyModel & Document
export const PartySchema = SchemaFactory.createForClass(PartyModel)
