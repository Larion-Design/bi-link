import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { Report } from 'defs'
import { CompanyDocument, CompanyModel } from '../../company/models/companyModel'
import { EventDocument, EventModel } from '../../event/models/eventModel'
import { FileDocument, FileModel, FileSchema } from '../../file/models/fileModel'
import { PersonDocument, PersonModel } from '../../person/models/personModel'
import {
  ProceedingDocument,
  ProceedingModel,
  ProceedingSchema,
} from '../../proceeding/models/proceedingModel'
import { PropertyDocument, PropertyModel } from '../../property/models/propertyModel'
import { DataRefModel, DataRefSchema } from './dataRefModel'
import { ReportSectionModel, ReportSectionSchema } from './reportSectionModel'

@Schema({ _id: true, timestamps: true })
export class ReportModel implements Report {
  _id: string

  @Prop()
  name: string

  @Prop()
  type: string

  @Prop({ index: true })
  isTemplate: boolean

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false, index: true })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: CompanyModel.name, isRequired: false, index: true })
  company?: CompanyDocument

  @Prop({ type: Types.ObjectId, ref: PropertyModel.name, isRequired: false, index: true })
  property?: PropertyDocument

  @Prop({ type: Types.ObjectId, ref: EventModel.name, isRequired: false, index: true })
  event?: EventDocument

  @Prop({ type: Types.ObjectId, ref: ProceedingModel.name, isRequired: false, index: true })
  proceeding?: ProceedingDocument

  @Prop({ type: [ReportSectionSchema], default: [] })
  sections: ReportSectionModel[]

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }], default: [], index: true })
  oldReportFiles: FileModel[]

  @Prop({ type: [DataRefSchema] })
  refs: DataRefModel[]

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type ReportDocument = ReportModel & Document
export const ReportSchema = SchemaFactory.createForClass(ReportModel)
