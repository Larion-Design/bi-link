import { MetadataModel, MetadataSchema } from '@app/models/models/metadata/metadataModel'
import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { File, FileSources } from 'defs'

@Schema({ timestamps: true })
export class FileModel implements File {
  _id: string

  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ unique: true, required: true })
  fileId: string

  @Prop({ isRequired: false, default: '' })
  name: string

  @Prop({ isRequired: false, default: '' })
  description: string

  @Prop({ unique: true })
  hash: string

  @Prop()
  mimeType: string

  @Prop({ enum: [FileSources.USER_UPLOAD], isRequired: false, default: FileSources.USER_UPLOAD })
  source: string

  @Prop({ isRequired: false, default: false })
  isHidden: boolean
}

export type FileDocument = FileModel & Document
export const FileSchema = SchemaFactory.createForClass(FileModel)
