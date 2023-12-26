import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ReportSection } from 'defs'
import { ReportContentModel, ReportContentSchema } from './reportContentModel'

@Schema({ timestamps: false, _id: false })
export class ReportSectionModel implements ReportSection {
  @Prop()
  name: string

  @Prop({ type: [ReportContentSchema] })
  content: ReportContentModel[]
}

export const ReportSectionSchema = SchemaFactory.createForClass(ReportSectionModel)
