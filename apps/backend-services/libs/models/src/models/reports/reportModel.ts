import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Report } from 'defs'
import { CompanyDocument, CompanyModel } from '@app/models/models/company/companyModel'
import { EventDocument, EventModel } from '@app/models/models/event/eventModel'
import { PersonDocument, PersonModel } from '@app/models/models/person/personModel'
import { PropertyDocument, PropertyModel } from '@app/models/models/property/propertyModel'
import { DataRefModel, DataRefSchema } from '@app/models/models/reports/dataRefModel'
import {
  ReportSectionModel,
  ReportSectionSchema,
} from '@app/models/models/reports/reportSectionModel'

@Schema({ _id: true, timestamps: true })
export class ReportModel implements Report {
  _id: string

  @Prop()
  name: string

  @Prop()
  type: string

  @Prop()
  isTemplate: boolean

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: CompanyModel.name, isRequired: false })
  company?: CompanyDocument

  @Prop({ type: Types.ObjectId, ref: PropertyModel.name, isRequired: false })
  property?: PropertyDocument

  @Prop({ type: Types.ObjectId, ref: EventModel.name, isRequired: false })
  event?: EventDocument

  @Prop({ type: [ReportSectionSchema] })
  sections: ReportSectionModel[]

  @Prop({ type: [DataRefSchema] })
  refs: DataRefModel[]

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type ReportDocument = ReportModel & Document
export const ReportSchema = SchemaFactory.createForClass(ReportModel)
