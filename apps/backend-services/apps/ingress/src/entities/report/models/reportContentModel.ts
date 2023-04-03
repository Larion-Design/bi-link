import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'
import { ReportContent } from 'defs'
import { GraphModel, GraphSchema } from './content/graphModel'
import { LinkModel, LinkSchema } from './content/linkModel'
import { TableModel, TableSchema } from './content/tableModel'
import { TextModel, TextSchema } from './content/textModel'
import { TitleModel, TitleSchema } from './content/titleModel'
import { FileModel } from '../../file/models/fileModel'

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
