import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ReportContentModel, ReportContentSchema } from '@app/entities/models/reportContentModel'
import { ReportSection } from '@app/definitions/reports/reportSection'

@Schema({ timestamps: false, _id: false })
export class ReportSectionModel implements ReportSection {
  @Prop()
  name: string

  @Prop({ type: [ReportContentSchema] })
  content: ReportContentModel[]
}

export type ReportSectionDocument = ReportSectionModel & Document
export const ReportSectionSchema = SchemaFactory.createForClass(ReportSectionModel)
