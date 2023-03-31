import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { ReportContent } from 'defs'
import { FileModel } from 'src/file/models/fileModel'
import { TitleModel, TitleSchema } from 'src/report/models/content/titleModel'
import { TextModel, TextSchema } from 'src/report/models/content/textModel'
import { LinkModel, LinkSchema } from 'src/report/models/content/linkModel'
import { TableModel, TableSchema } from 'src/report/models/content/tableModel'
import { GraphModel, GraphSchema } from 'src/report/models/content/graphModel'

@Schema({ timestamps: false, _id: false })
export class ReportContentModel implements ReportContent {
  @Prop()
  order: number

  @Prop()
  isActive: boolean

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
