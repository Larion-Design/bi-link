import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes } from 'mongoose'
import { IdDocument, IdDocumentStatus } from 'defs'

@Schema({ _id: false })
export class IdDocumentModel implements IdDocument {
  constructor(idDocument?: IdDocument) {
    if (idDocument) {
      this.documentType = idDocument.documentType
      this.documentNumber = idDocument.documentNumber
      this.issueDate = idDocument.issueDate
      this.expirationDate = idDocument.expirationDate
    }
  }

  @Prop({ isRequired: true })
  documentType: string

  @Prop({ isRequired: true, unique: true, sparse: true })
  documentNumber: string

  @Prop({ type: SchemaTypes.Date, isRequired: false })
  issueDate?: string | Date

  @Prop({ type: SchemaTypes.Date, isRequired: false })
  expirationDate?: string | Date

  @Prop({ type: SchemaTypes.String, default: IdDocumentStatus.VALID })
  status: IdDocumentStatus
}

export const IdDocumentSchema = SchemaFactory.createForClass(IdDocumentModel)
