import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Report } from 'defs'
import { Document, Types } from 'mongoose'
import { PersonDocument, PersonModel } from '@app/entities/models/personModel'
import { CompanyDocument, CompanyModel } from '@app/entities/models/companyModel'
import { ReportSectionModel, ReportSectionSchema } from '@app/entities/models/reportSectionModel'
import { PropertyDocument, PropertyModel } from '@app/entities/models/propertyModel'
import { IncidentDocument, IncidentModel } from '@app/entities/models/incidentModel'

@Schema()
export class ReportModel implements Report {
  @Prop()
  name: string

  @Prop({ type: Types.ObjectId, ref: PersonModel.name, isRequired: false })
  person?: PersonDocument

  @Prop({ type: Types.ObjectId, ref: CompanyModel.name, isRequired: false })
  company?: CompanyDocument

  @Prop({ type: Types.ObjectId, ref: PropertyModel.name, isRequired: false })
  property?: PropertyDocument

  @Prop({ type: Types.ObjectId, ref: IncidentModel.name, isRequired: false })
  incident?: IncidentDocument

  @Prop({ type: [ReportSectionSchema] })
  sections: ReportSectionModel[]
}

export type ReportDocument = ReportModel & Document
export const ReportSchema = SchemaFactory.createForClass(ReportModel)
