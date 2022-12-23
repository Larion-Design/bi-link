import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { FileModel } from '@app/entities/models/fileModel'
import { ReportContent } from '@app/definitions/reports/reportContent'
import { TitleModel, TitleSchema } from '@app/entities/models/reports/titleModel'
import { TextModel, TextSchema } from '@app/entities/models/reports/textModel'
import { LinkModel, LinkSchema } from '@app/entities/models/reports/linkModel'
import { TableModel, TableSchema } from '@app/entities/models/reports/tableModel'

@Schema({ timestamps: false, _id: false })
export class ReportContentModel implements ReportContent {
  @Prop()
  order: number

  @Prop({ type: [TitleSchema], isRequired: false })
  title?: TitleModel

  @Prop({ type: Types.ObjectId, ref: FileModel.name, isRequired: false })
  file: FileModel

  @Prop({ type: [TextSchema], isRequired: false })
  text?: TextModel

  @Prop({ type: [{ type: Types.ObjectId, ref: FileModel.name }], isRequired: false })
  images?: FileModel[]

  @Prop({ type: [TableSchema], isRequired: false })
  table?: TableModel

  @Prop({ type: [LinkSchema], isRequired: false })
  link?: LinkModel
}

export type ReportContentDocument = ReportContentModel & Document
export const ReportContentSchema = SchemaFactory.createForClass(ReportContentModel)
