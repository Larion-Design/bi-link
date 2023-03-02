import { GraphModel, GraphSchema } from '@app/models/models/reports/content/graphModel'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { FileModel } from '@app/models/models/fileModel'
import { ReportContent } from 'defs'
import { TitleModel, TitleSchema } from '@app/models/models/reports/content/titleModel'
import { TextModel, TextSchema } from '@app/models/models/reports/content/textModel'
import { LinkModel, LinkSchema } from '@app/models/models/reports/content/linkModel'
import { TableModel, TableSchema } from '@app/models/models/reports/content/tableModel'

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

  @Prop({ type: [GraphSchema], isRequired: false })
  graph?: GraphModel
}

export const ReportContentSchema = SchemaFactory.createForClass(ReportContentModel)
