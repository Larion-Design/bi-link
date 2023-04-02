import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Report } from 'defs'
import { CompanyDocument, CompanyModel } from 'src/company/models/companyModel'
import { EventDocument, EventModel } from 'src/event/models/eventModel'
import { PersonDocument, PersonModel } from 'src/person/models/personModel'
import { PropertyDocument, PropertyModel } from 'src/property/models/propertyModel'
import { DataRefModel, DataRefSchema } from 'src/report/models/dataRefModel'
import { ReportSectionModel, ReportSectionSchema } from 'src/report/models/reportSectionModel'

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