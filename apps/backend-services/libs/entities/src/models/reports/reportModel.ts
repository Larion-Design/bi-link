import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Report } from 'defs'
import { CompanyDocument, CompanyModel } from '@app/entities/models/company/companyModel'
import { EventDocument, EventModel } from '@app/entities/models/event/eventModel'
import { PersonDocument, PersonModel } from '@app/entities/models/person/personModel'
import { PropertyDocument, PropertyModel } from '@app/entities/models/property/propertyModel'
import { DataRefModel, DataRefSchema } from '@app/entities/models/reports/refs/dataRefModel'
import {
  ReportSectionModel,
  ReportSectionSchema,
} from '@app/entities/models/reports/reportSectionModel'

@Schema({ _id: true, timestamps: true })
export class ReportModel implements Report {
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
  incident?: EventDocument

  @Prop({ type: [ReportSectionSchema] })
  sections: ReportSectionModel[]

  @Prop({ type: [DataRefSchema] })
  refs: DataRefModel[]
}

export type ReportDocument = ReportModel & Document
export const ReportSchema = SchemaFactory.createForClass(ReportModel)
