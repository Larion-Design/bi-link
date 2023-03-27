import { Document } from 'mongoose'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { File } from 'defs'
import { MetadataModel, MetadataSchema } from '@app/models/models/metadata/metadataModel'

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

  @Prop()
  source: string

  @Prop({ isRequired: false, default: false })
  isHidden: boolean

  @Prop()
  createdAt?: Date

  @Prop()
  updatedAt?: Date
}

export type FileDocument = FileModel & Document
export const FileSchema = SchemaFactory.createForClass(FileModel)
