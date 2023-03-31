import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { IdDocument, IdDocumentStatus } from 'defs'
import { MetadataModel, MetadataSchema } from '@app/models/metadata/models/metadataModel'

@Schema({ _id: false, timestamps: false })
export class IdDocumentModel implements IdDocument {
  @Prop({ type: MetadataSchema })
  metadata: MetadataModel

  @Prop({ isRequired: true })
  documentType: string

  @Prop()
  documentNumber: string

  @Prop({ type: SchemaTypes.Date, default: null })
  issueDate: Date | string | null

  @Prop({ type: SchemaTypes.Date, default: null })
  expirationDate: Date | string | null

  @Prop({ type: SchemaTypes.String })
  status: IdDocumentStatus
}

export const IdDocumentSchema = SchemaFactory.createForClass(IdDocumentModel)
